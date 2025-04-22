import connect from "./utils/connect";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { server } from "./utils/socket";
dotenv.config();

const port = process.env.PORT || 5001;

server.listen(port, () => {
  logger.info(`api running on ${port}`);
  connect();
});

module.exports = server;