import {Squad} from './squad';
import {Slot} from './slot';
import {SlotContainer} from './slotContainer';
import {SelfContainedUnit} from './selfContainedUnit';

export interface Platoon extends SlotContainer, SelfContainedUnit {
  squad: Squad[];
}
