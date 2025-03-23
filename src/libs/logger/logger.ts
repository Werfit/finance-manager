class Logger {
  log(message: string) {
    console.log(`Log: ${message}`);
  }

  error(message: string) {
    console.error(`Error: ${message}`);
  }
}

export const logger = new Logger();
