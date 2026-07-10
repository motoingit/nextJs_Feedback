import chalk from "chalk";

// Check if we are running in the server environment (Node.js/Next.js server context)
if (typeof window === "undefined" && !(global as any).__logger_initialized) {
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
      .replace(/\[SUCCESS\]\s*>?/gi, chalk.bgGreen.black.bold(" SUCCESS "))
      .replace(/\[ERROR\]\s*>?/gi, chalk.bgRed.white.bold(" ERROR "))
      .replace(/\[WARN\]\s*>?/gi, chalk.bgYellow.black.bold(" WARN "))
      .replace(/\[INFO\]\s*>?/gi, chalk.bgBlue.white.bold(" INFO "))
      .replace(/\[DEBUG\]\s*>?/gi, chalk.bgGray.white.bold(" DEBUG "))
      .replace(/\[API\]\s*>?/gi, chalk.bgCyan.black.bold(" API "))
      .replace(/\[AUTH\]\s*>?/gi, chalk.bgMagenta.white.bold(" AUTH "))
      .replace(/\[Proxy\]\s*>?/gi, chalk.bgCyan.black.bold(" PROXY "))
      .replace(/🚦\s*\[Proxy\]\s*>?/gi, chalk.bgCyan.black.bold(" PROXY "))
      .replace(/➡️\s*\[Proxy\]\s*>?/gi, chalk.bgCyan.black.bold(" PROXY "));

    return [message, "\n"];
  };

  console.log = (...args: any[]) => originalLog(...formatLogMessage(args));
  console.info = (...args: any[]) => originalInfo(...formatLogMessage(args));
  console.warn = (...args: any[]) => originalWarn(...formatLogMessage(args));
  console.error = (...args: any[]) => originalError(...formatLogMessage(args));
}
