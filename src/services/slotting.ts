import { Match } from '@/models';
import { FORUM_URI } from '.';
import { fetchJSON, ResponseError } from './utils';

export const getMatches = async (tid: string): Promise<Match[]> => {
    try {
        return await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${tid}`);
    } catch (err) {
        if (err instanceof ResponseError && err.response.status === 404) return [];
        throw err;
    }
};
