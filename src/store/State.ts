import { Match } from '@/models';
import { Settings } from '@/services/settings';

export default interface State {
    matches: { [uuid: string]: Match|undefined };
    settings: Settings;
    currentGroup: string;
}
