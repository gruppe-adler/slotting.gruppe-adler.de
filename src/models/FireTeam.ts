import { Slot } from '.';

export default interface FireTeam {
    slot: Slot[];
    'min-slotted-player-count'?: number;
    'reserved-for'?: string;
}
