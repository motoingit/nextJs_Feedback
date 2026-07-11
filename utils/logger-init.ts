import chalk from "chalk";

// Check if we are running in the server environment (Node.js/Next.js server context)
if (
  process.env.NODE_ENV === "development" &&
  typeof window === "undefined" &&
  !(global as any).__logger_initialized
) {
  (global as any).__logger_initialized = true;

  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  const formatLogMessage = (args: any[]): any[] => {
    // Join arguments into a single string
    let message = args
      .map((arg) => {
        if (arg instanceof Error) {
          return arg.stack || arg.message;
        }
        if (typeof arg === "object" && arg !== null) {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      })
      .join(" ");

    // Standardize status tags with bold background colors
    message = message
      .replace(
        /^SUCCESS;/i,
        chalk.bgGreen.black.bold(" SUCCESS ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^ERROR;/i,
        chalk.bgRed.white.bold(" ERROR ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^WARN;/i,
        chalk.bgYellow.black.bold(" WARN ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^INFO;/i,
        chalk.bgBlue.white.bold(" INFO ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^DEBUG;/i,
        chalk.bgGray.white.bold(" DEBUG ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^API;/i,
        chalk.bgCyan.black.bold(" API ") + chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^AUTH;/i,
        chalk.bgMagenta.white.bold(" AUTH ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      )

      .replace(
        /^PROXY;/i,
        chalk.bgCyan.black.bold(" PROXY ") +
          chalk.rgb(255, 105, 180).bold(" > "),
      );

    return [message, "\n"];
  };

  console.log = (...args: any[]) => originalLog(...formatLogMessage(args));
  console.info = (...args: any[]) => originalInfo(...formatLogMessage(args));
  console.warn = (...args: any[]) => originalWarn(...formatLogMessage(args));
  console.error = (...args: any[]) => originalError(...formatLogMessage(args));
}
