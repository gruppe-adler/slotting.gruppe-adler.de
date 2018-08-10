import {Platoon} from './platoon';
import {SlotContainer} from './slotContainer';
import {Squad} from './squad';
import {SelfContainedUnit} from './selfContainedUnit';

export interface Company extends SlotContainer, SelfContainedUnit {
  platoon: Platoon[];
  squad: Squad[];
}
