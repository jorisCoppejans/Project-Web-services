const config = require('config');
const createServer = require('./createServer.js')


async function main() {
  try {
    const server = await createServer();
    await server.start();

    //opruimactiviteiten en shutdown van de server
    async function onClose(){
      await server.stop();
      process.exit(0);
    }

    process.on('SIGTERM', onClose);
    process.on('SIGQUIT', onClose);

  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
}

main();