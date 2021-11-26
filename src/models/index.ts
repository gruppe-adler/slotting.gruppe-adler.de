import type Company from './Company';
import type FireTeam from './FireTeam';
import type Platoon from './Platoon';
import type Slot from './Slot';
import type Squad from './Squad';
import type { IMatch } from './Match';
import { Match } from './Match';
import type User from './User';

// TODO: Maybe use enums?
type NatoSymbol = string;
type Side = string;
type VehicleType = string;

export { Company, Platoon, Squad, FireTeam, Slot, IMatch, Match, NatoSymbol, Side, VehicleType, User };
