import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { makePassword } from "@/utils/passwordManager";

type SeedUser = {
  username: string;
  email: string;
  password: string;
};

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

async function seed({ username, email, password }: SeedUser) {
  try {
    loadProjectEnv();
    await dbConnect();

    console.log("🌱 Starting seed...");

    // Check verified username
    const existingVerifiedUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUsername) {
      console.warn(
        `❌ Username "${username}" is already used by a verified account.`,
      );
      return;
    }

    // Check verified email
    const existingVerifiedEmail = await User.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedEmail) {
      console.warn(`❌ Email "${email}" is already registered and verified.`);
      return;
    }

    // Remove old unverified username conflicts
    const deletedUsernameConflicts = await User.deleteMany({
      username,
      email: { $ne: email },
      isVerified: false,
    });

    if (deletedUsernameConflicts.deletedCount > 0) {
      console.log(
        `🗑 Deleted ${deletedUsernameConflicts.deletedCount} unverified username conflict(s).`,
      );
    }

    // Remove old unverified email (if exists)
    await User.deleteOne({
      email,
      isVerified: false,
    });


    const hashedPassword = await makePassword(password);

    // Create verified user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,

      // Dummy values (not used because user is already verified)
      verifyCode: "000000",
      verifyCodeExpiry: new Date(Date.now()),

      isVerified: true,
      isAcceptingMessage: true,
      messages: [],
    });

    console.log("✅ User created successfully!");
    console.log("--------------------------------");
    console.log(`Username : ${newUser.username}`);
    console.log(`Email    : ${newUser.email}`);
    console.log(`Verified : ${newUser.isVerified}`);
    console.log("--------------------------------");
  } catch (error) {
    console.error("❌ Seed failed");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed({
  username: "rohit",
  email: "rohit@gmail.com",
  password: "rohitrohit",
});
