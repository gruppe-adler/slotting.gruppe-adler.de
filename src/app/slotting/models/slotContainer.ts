import {Slot} from './slot';

export interface SlotContainer {
  slot: Slot[];
  'min-slotted-player-count': number;
  'reserved-for': string;
}
