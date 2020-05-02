import {ServerRoute} from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import VFSVisaApplicationCenterController from './controller/vfs_visa_application_centers_controller';
import type {DependencyContainer} from 'tsyringe';

export const makeRouter = (container: DependencyContainer): ServerRoute[] => {
  const vfsApplicationCentersController = container.resolve(
    VFSVisaApplicationCenterController
  );

  return [
    {
      method: 'GET',
      path: '/vfs-application-centers',
      handler: vfsApplicationCentersController.getApplicationCenters.bind(
        vfsApplicationCentersController
      ),
      options: {
        validate: {
          query: Joi.object({
            from: Joi.string().optional(),
            to: Joi.string().optional(),
            toast_message: Joi.string().optional(),
          }),
        },
      },
    },
  ];
};

export type Router = ReturnType<typeof makeRouter>;
