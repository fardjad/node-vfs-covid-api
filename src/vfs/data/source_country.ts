import type DestinationCountry from './destination_country';

export default interface SourceCountry {
  name: string;
  visiting: DestinationCountry[];
}
