console.${1:log}(`\x1b[32m[${2:info}-log]:LogString\x1b[0m > \x1b[33m⚠️ Request format validation failed for verify-code\x1b[0m : \x1b[33m${errorMessage}\x1b[0m`);

console.log(
  chalk.green("[INFO]"),
  ">",
  chalk.yellow("⚠️ Request format validation failed for verify-code"),
  ":",
  chalk.yellow(errorMessage)
);
