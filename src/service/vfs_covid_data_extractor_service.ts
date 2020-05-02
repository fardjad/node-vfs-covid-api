import {Lifecycle, scoped} from 'tsyringe';
import {ExpiringNiladicFunctionMemoizer} from '../cache/expiring_niladic_function_memoizer';
import DestinationCountry from '../vfs/data/destination_country';
import VfsCovidDataExtractor from '../vfs/vfs_covid_data_extractor';
import type SourceCountry from '../vfs/data/source_country';

type Predicate<T> = (object: T) => boolean;

@scoped(Lifecycle.ContainerScoped)
export default class VFSCovidDataExtractorService {
  private fetchData: () => Promise<SourceCountry[]>;

  public constructor(
    vfsCovidDataExtractor: VfsCovidDataExtractor,
    expiringNiladicFunctionMemoizer: ExpiringNiladicFunctionMemoizer
  ) {
    this.fetchData = expiringNiladicFunctionMemoizer.memoize(
      vfsCovidDataExtractor.extractVfsCovidData.bind(vfsCovidDataExtractor)
    );
  }

  public async fetchAllAndFilter(
    fromPredicate: Predicate<SourceCountry>,
    toPredicate: Predicate<DestinationCountry>,
    toastMessagePredicate: Predicate<DestinationCountry>
  ) {
    const data = await this.fetchData();
    return data
      .map(({name, visiting}) => ({
        name,
        visiting: visiting.filter(toPredicate).filter(toastMessagePredicate),
      }))
      .filter(fromPredicate)
      .filter(sourceCountry => sourceCountry.visiting.length > 0);
  }
}
