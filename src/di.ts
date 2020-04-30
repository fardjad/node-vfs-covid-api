import {Lifecycle, instanceCachingFactory} from 'tsyringe';
import * as esTreeWalker from 'estree-walker';
import {DynamicPool} from 'node-worker-threads-pool';
import vfsConfig, {VFSConfig} from './config/vfs_config';
import threadPoolConfig, {ThreadPoolConfig} from './config/thread_pool_config';
import ESTreeCodeGenerator from './estree/estree_code_generator';
import ESTreeParser from './estree/estree_parser';
import ESTreeWalker from './estree/estree_walker';
import AcornESTreeParser from './estree/acorn_estree_parser';
import AstringESTreeCodeGenerator from './estree/astring_estree_code_generator';
import VFSScriptFetcher from './vfs/vfs_script_fetcher';
import VFSScriptFetcherImpl from './vfs/vfs_script_fetcher_impl';
import {makeServer, Server} from './server';
import {makeRouter, Router} from './router';
import serverConfig, {ServerConfig} from './config/server_config';
import {makeDynamicPool} from './dynamic_pool';
import {
  ExpiringNiladicFunctionMemoizer,
  makeExpiringNiladicFunctionMemoizer,
} from './cache/expiring_niladic_function_memoizer';
import type {DependencyContainer} from 'tsyringe';

export const initContainer = (container: DependencyContainer) => {
  container.reset();
  container.register<ServerConfig>('ServerConfig', {
    useValue: serverConfig,
  });

  container.register<ThreadPoolConfig>('ThreadPoolConfig', {
    useValue: threadPoolConfig,
  });

  container.register<VFSConfig>('VFSConfig', {
    useValue: vfsConfig,
  });

  container.register<ESTreeCodeGenerator>(
    'ESTreeCodeGenerator',
    {
      useClass: AstringESTreeCodeGenerator,
    },
    {lifecycle: Lifecycle.Singleton}
  );

  container.register<ESTreeParser>(
    'ESTreeParser',
    {
      useClass: AcornESTreeParser,
    },
    {lifecycle: Lifecycle.Singleton}
  );

  container.register<ESTreeWalker>('ESTreeWalker', {useValue: esTreeWalker});

  container.register<DynamicPool>(DynamicPool, {
    useFactory: instanceCachingFactory(makeDynamicPool),
  });

  container.register<VFSScriptFetcher>(
    'VFSScriptFetcher',
    {
      useClass: VFSScriptFetcherImpl,
    },
    {lifecycle: Lifecycle.Singleton}
  );

  container.register<ExpiringNiladicFunctionMemoizer>(
    ExpiringNiladicFunctionMemoizer,
    {useFactory: instanceCachingFactory(makeExpiringNiladicFunctionMemoizer)}
  );

  container.register<Router>('Router', {
    useFactory: instanceCachingFactory(makeRouter),
  });

  container.register<Server>('Server', {
    useFactory: instanceCachingFactory(makeServer),
  });
};
