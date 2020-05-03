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
      options: {
        handler: vfsApplicationCentersController.getApplicationCenters.bind(
          vfsApplicationCentersController
        ),
        description: 'Get Visa Application Centers',
        tags: ['api'],
        validate: {
          query: Joi.object({
            from: Joi.string()
              .optional()
              .description("The country you're applying from"),
            to: Joi.string()
              .optional()
              .description("The country you're going to visit"),
            toast_message: Joi.string()
              .optional()
              .description(
                "Can be used for filtering the results based on visa application centers' statuses"
              ),
          }),
        },
        response: {
          schema: Joi.array()
            .required()
            .items(
              Joi.object({
                name: Joi.string().required(),
                visiting: Joi.array()
                  .required()
                  .items(
                    Joi.object({
                      name: Joi.string().required(),
                      contact_url: Joi.string().optional(),
                      url: Joi.string().optional(),
                      toast_message: Joi.string()
                        .optional()
                        .description('Visa application center status'),
                    })
                      .unknown(true)
                      .label('DestinationCountry')
                  )
                  .label('DestinationCountries'),
              }).label('SourceCountry')
            )
            .label('VisaApplicationCenters'),
        },
      },
    },
  ];
};

export type Router = ReturnType<typeof makeRouter>;
