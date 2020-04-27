export default interface DestinationCountry {
  name: string;
  url: string;
  contactUrl: string;
  toastMessage?: 'Opened' | 'Closed';
}
