import { User } from '.';

export default interface Slot {
    description: string;
    shortcode: string;
    uuid: string;
    user?: User;
    'min-slotted-player-count'?: number;
    'reserved-for'?: string;
}
