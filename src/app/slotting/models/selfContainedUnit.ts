import {Side} from './side';
import {IBlockable} from './blockable';
export interface SelfContainedUnit extends IBlockable {
  natosymbol?: string;
  callsign?: string;
  vehicletype?: string;
  frequency?: string; // TODO doublecheck
  side?: Side;
}
