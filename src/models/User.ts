
export default interface User {
  uid: number,
  username: string;
  userslug: string;
  picture: string|null;
  'icon:text': string;
  'icon:bgColor': string;
  groupTitle: string;
  groupTitleArray: string[];
  administrator: boolean;
  groups: string[];
}
