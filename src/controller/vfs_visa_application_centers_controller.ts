import {internal} from '@hapi/boom';
import {scoped, Lifecycle} from 'tsyringe';
import SourceCountry from '../vfs/data/source_country';
import VFSCovidDataExtractorService from '../service/vfs_covid_data_extractor_service';
import type {Request} from '@hapi/hapi';
import type DestinationCountry from '../vfs/data/destination_country';

@scoped(Lifecycle.ContainerScoped)
export default class VFSVisaApplicationCenterController {
  public constructor(
    private vfsCovidDataExtractorService: VFSCovidDataExtractorService
  ) {}

  public async getApplicationCenters(req: Request) {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const toastMessage = req.query.toast_message as string | undefined;

    const fromPredicate = this.makeObjectFieldMatcherPredicate<SourceCountry>(
      'name',
      from
    );

    const toPredicate = this.makeObjectFieldMatcherPredicate<
      DestinationCountry
    >('name', to);

    const toastMessagePredicate = this.makeObjectFieldMatcherPredicate<
      DestinationCountry
    >('toast_message', toastMessage);

    let response: SourceCountry[];
    try {
      response = await this.vfsCovidDataExtractorService.fetchAllAndFilter(
        fromPredicate,
        toPredicate,
        toastMessagePredicate
      );
    } catch (ex) {
      throw internal((ex as Error).message);
    }

    return response;
  }

  private makeObjectFieldMatcherPredicate<T>(
    fieldName: keyof T,
    valueToCompare: T[keyof T] | undefined
  ) {
    return (obj: T) => {
      if (valueToCompare == null) {
        return true;
      }

      const field = obj[fieldName];

      if (typeof field === 'string' && typeof valueToCompare === 'string') {
        return valueToCompare.toLowerCase() === field.toLowerCase();
      } else {
        return valueToCompare === field;
      }
    };
  }
}
