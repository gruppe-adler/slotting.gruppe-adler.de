import {Slot} from './slot';
import {Fireteam} from './fireteam';
import {SlotContainer} from './slotContainer';
import {SelfContainedUnit} from './selfContainedUnit';

export interface Squad extends SlotContainer, SelfContainedUnit {
  fireteam: Fireteam[];
}
