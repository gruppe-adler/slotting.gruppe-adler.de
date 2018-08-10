import {IBlockable} from './blockable';

export interface Slot extends IBlockable {
  uuid: string | undefined;
  user?: any; // IMatchInputUser | IMatchOutputUser;
  shortcode: string;
  description: string;
}
