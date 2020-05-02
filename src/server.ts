import * as Hapi from '@hapi/hapi';
import {DependencyContainer} from 'tsyringe';
import type {ServerConfig} from './config/server_config';
import type {Router} from './router';

export const makeServer = (container: DependencyContainer) => {
  const {HOST: host, PORT: port} = container.resolve<ServerConfig>(
    'ServerConfig'
  );

  const router = container.resolve<Router>('Router');

  const server = Hapi.server({
    port,
    host,
    router: {
      stripTrailingSlash: true,
    },
  });

  server.route(router);

  return server;
};

export type Server = ReturnType<typeof makeServer>;
