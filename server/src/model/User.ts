export default interface User {
  name: string;
  enabled: boolean;
  creationDate: number; // unix stamp
  hash: string; // hash of password
}
