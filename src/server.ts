import * as path from 'path';
import * as Hapi from '@hapi/hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import {DependencyContainer} from 'tsyringe';
import * as pkg from '../package.json';
import type {ServerConfig} from './config/server_config';
import type {Router} from './router';

export const makeServer = async (container: DependencyContainer) => {
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

  await server.register([
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: {
        templates: path.join(__dirname, './swagger/templates'),
        documentationPath: '/api',
        info: {
          title: pkg.name,
          description: pkg.description,
          version: pkg.version,
        },
      },
    },
  ]);

  server.route(router);

  return server;
};

export type Server = ReturnType<typeof makeServer>;
