import 'reflect-metadata';
import {container} from 'tsyringe';
import {initContainer} from './di';
import {Server} from './server';

const init = async () => {
  initContainer(container);
  const server = await container.resolve<Server>('Server');
  await server.start();
  console.log('Server is listening on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

init();
