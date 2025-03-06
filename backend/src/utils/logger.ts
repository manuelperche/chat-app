import logger from "pino";

const log = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export default log;
