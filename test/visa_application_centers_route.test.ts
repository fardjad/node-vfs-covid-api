import 'reflect-metadata';
import {script} from '@hapi/lab';
import {expect} from '@hapi/code';
import * as getPort from 'get-port';
import {container} from 'tsyringe';
import {initContainer} from '../src/di';
import VFSScriptFetcher from '../src/vfs/vfs_script_fetcher';
import {FileVFSScriptFetcher} from './support/file_vfs_script_fetcher';
import {ErrorVFSScriptFetcher} from './support/error_vfs_script_fetcher';
import type {DependencyContainer} from 'tsyringe';
import type {Server} from '@hapi/hapi';
import type {ServerConfig} from '../src/config/server_config';
import SourceCountry from '../src/vfs/data/source_country';

export const lab = script();
const {describe, it, beforeEach, afterEach} = lab;

describe('visa-application-centers route', () => {
  let server: Server;
  let testContainer: DependencyContainer;

  describe('given server is not working properly', () => {
    beforeEach(() => {
      givenServerIsNotWorkingProperly();
    });

    const givenServerIsNotWorkingProperly = async () => {
      await configureTestContainer();
      testContainer.register<VFSScriptFetcher>('VFSScriptFetcher', {
        useClass: ErrorVFSScriptFetcher,
      });
      return startServer();
    };

    it('should return an error response', async () => {
      const response = await whenIGetAllApplicationCenters();

      expect(response.statusCode).to.be.equal(500);
    });
  });

  describe('given server is working properly', () => {
    beforeEach(() => {
      givenServerIsWorking();
    });

    const givenServerIsWorking = async () => {
      await configureTestContainer();
      testContainer.register<VFSScriptFetcher>('VFSScriptFetcher', {
        useClass: FileVFSScriptFetcher,
      });
      return startServer();
    };

    it('should return the status of all visa application centers', async () => {
      const response = await whenIGetAllApplicationCenters();

      expect(response.statusCode).to.be.equal(200);
      expect(response.result).to.be.an.array();
      expect((response.result as SourceCountry[]).length).to.be.greaterThan(0);
    });

    it('should filter the countries by toastMessage', async () => {
      const response = await whenIGetTheApplicationCentersWithACertainToastMessage(
        'NON_EXISTENT_TOAST_MESSAGE'
      );

      expect(response.statusCode).to.be.equal(200);
      expect(response.result).to.be.equal([]);
    });

    describe('and source country exists', () => {
      describe('and destination country exists', () => {
        it('should return the queried country status', async () => {
          const response = await whenIGetTheStatusOfCertainApplicationCenter(
            'united arab emirates',
            'the netherlands'
          );

          expect(response.statusCode).to.be.equal(200);
          expect(response.result).to.be.an.array();
          expect(response.result).to.have.length(1);
        });
      });

      describe('and destination country does not exist', () => {
        it('visiting must be equal to an empty array', async () => {
          const response = await whenIGetTheStatusOfCertainApplicationCenter(
            'united arab emirates',
            'nowhere'
          );

          expect(response.statusCode).to.be.equal(200);
          expect(response.result).to.be.equal([]);
        });
      });
    });

    describe('and source country does not exist', () => {
      it('should return an empty array', async () => {
        const response = await whenIGetTheStatusOfCertainApplicationCenter(
          'nowhere',
          'canada'
        );

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.equal([]);
      });
    });
  });

  const whenIGetAllApplicationCenters = () => {
    return server.inject({
      method: 'GET',
      url: '/api/vfs-application-centers',
    });
  };

  const whenIGetTheStatusOfCertainApplicationCenter = (
    from: string,
    to: string
  ) => {
    return server.inject({
      method: 'GET',
      url: `/api/vfs-application-centers?from=${from}&to=${to}`,
    });
  };

  const whenIGetTheApplicationCentersWithACertainToastMessage = (
    toastMessage: string
  ) => {
    return server.inject({
      method: 'GET',
      url: `/api/vfs-application-centers?toast_message=${toastMessage}`,
    });
  };

  const configureTestContainer = async () => {
    initContainer(container);
    testContainer = container.createChildContainer();
    testContainer.register<ServerConfig>('ServerConfig', {
      useValue: {
        HOST: '127.0.0.1',
        PORT: await getPort(),
      },
    });
    return testContainer;
  };

  const startServer = async () => {
    server = await testContainer.resolve('Server');
    return server.start();
  };

  afterEach(() => {
    return server.stop();
  });
});
