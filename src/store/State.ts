import { Match } from '@/models';

export interface SlotStatistic {
    max: number,
    count: number
}

export default interface State {
    matches: Match[];
    statistics: { [id: string]: SlotStatistic };
    showGroupColor: boolean;
    ownedDLCs: string[],
    currentGroup: string;
}
