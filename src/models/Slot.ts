export default interface Slot {
    description: string;
    shortcode: string;
    uuid: string;
    'min-slotted-player-count'?: number;
    'reserved-for'?: string;
}
