import fs from "node:fs";
import path from "node:path";

import dbConnect from "../lib/dbConnect";
import UserModel from "../model/User";

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmedLine.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();
    let value = trimmedLine.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadProjectEnv() {
  const projectRoot = path.resolve(process.cwd());
  loadEnvFile(path.join(projectRoot, ".env.local"));
  loadEnvFile(path.join(projectRoot, ".env"));
}

async function main() {
  loadProjectEnv();

  if (!process.env.MONGO_DB_URI) {
    console.error("MONGO_DB_URI is missing. Add it to .env.local or set it in your shell.");
    process.exitCode = 1;
    return;
  }

  await dbConnect();

  const users = await UserModel.find({}).select("-password").lean();

  if (users.length === 0) {
    console.log("No users found in the database.");
    return;
  }

  console.log(`Found ${users.length} user(s):`);

  users.forEach((user, index) => {
    console.log(`\nUser #${index + 1}`);
    console.log(JSON.stringify(user, null, 2));
  });
}

main().catch((error) => {
  console.error("Failed to dump users:", error);
  process.exitCode = 1;
});
