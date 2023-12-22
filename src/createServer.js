const Koa = require("koa");
const config = require("config");
const cron = require("node-cron");


const installRest = require("./rest");
const { initializeData, shutdownData } = require("./data");
const installMiddleware = require("./core/installMiddlewares");
const { initializeLogger, getLogger } = require("./core/logging");


const NODE_ENV = config.get("env");
const LOG_LEVEL = config.get("logging.level");
const LOG_DISABLED = config.get("logging.disabled");



module.exports = async function createServer() {
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });

  
  await initializeData();

  cron.schedule("0 12,18 * * *", async () => {
    const logger = getLogger();
    logger.info("Running seed at", new Date());
    
    try {
      await initializeData();
    } catch (error) {
      logger.error("Error while running seed", { error });
    }
  });

  const app = new Koa();

  installMiddleware(app);
  
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise((resolve) => {
        app.listen(9000, () => {
          getLogger().info("🚀 Server listening on http://localhost:9000");
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info("Goodbye! 👋");
    },
  };
};