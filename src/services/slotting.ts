import { IMatch, Match, User } from '@/models';
import router from '@/router';
import { FORUM_URI } from '.';
import { fetchJSON, ResponseError } from './utils';

export const fetchMatches = async (tid: string): Promise<Match[]> => {
    try {
        const data: IMatch[] = await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${tid}?withusers=1`);

        return data.map(m => new Match(m));
    } catch (err) {
        if (err instanceof ResponseError && err.response.status === 404) return [];
        throw err;
    }
};

export const fetchMatch = async (tid: string, matchUUID: string): Promise<Match|null> => {
    try {
        const data: IMatch = await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${tid}/match/${matchUUID}?withusers=1`);

        return new Match(data);
    } catch (err) {
        if (err instanceof ResponseError && err.response.status === 404) return null;
        throw err;
    }
};

export const createMatch = async (): Promise<string> => {
    // TODO: error handling, confirmation
    return await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${getTopicID()}/match`, { method: 'POST', body: '<match></match>' });
};

export const deleteMatch = async (tid: string, matchId: string): Promise<void> => {
    // TODO: error handling, confirmation
    await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${tid}/match/${matchId}`, { method: 'DELETE' });
};

export const getTopicID = (): string => {
    const q = router.currentRoute.value.query.tid ?? '';
    return (typeof q === 'object' ? q[0] : q) ?? '';
};

export const getMatchID = (): string => {
    const q = router.currentRoute.value.query.mid ?? '';
    return (typeof q === 'object' ? q[0] : q) ?? '';
};

export const getOwnUserId = async (): Promise<number> => {
    // TODO: error handling, user might not be logged in
    const result = await fetchJSON<User>(`${FORUM_URI}/api/me`);
    return result.uid;
};
