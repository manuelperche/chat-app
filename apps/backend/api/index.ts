import { createServer } from "./server";
import connect from "./utils/connect";
import dotenv from "dotenv";
import logger from "./utils/logger";
dotenv.config();

const port = process.env.PORT || 5001;
const server = createServer();

server.listen(port, () => {
  logger.info(`api running on ${port}`);
  connect();
});

module.exports = server;