import { Match } from '@/models';
import { Settings } from '@/services/settings';

export interface SlotStatistic {
    max: number,
    count: number
}

export default interface State {
    matches: Match[];
    statistics: { [id: string]: SlotStatistic };
    settings: Settings;
    currentGroup: string;
}
