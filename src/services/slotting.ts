import { Match } from '@/models';
import router from '@/router';
import { FORUM_URI } from '.';
import { fetchJSON, ResponseError } from './utils';

export const getMatches = async (tid: string): Promise<Match[]> => {
    try {
        const matches: Match[] = await fetchJSON(`${FORUM_URI}/api/arma3-slotting/${tid}?withusers=1`);

        matches.map(normalizeNode);
        return matches;
    } catch (err) {
        if (err instanceof ResponseError && err.response.status === 404) return [];
        throw err;
    }
};

// The current backend uses '0' as a default value for the reserved-for and vehicletype
// properties. We do not want that, becase it breaks stuff so normalizeNode takes care
// of that shit
const fields = ['fireteam', 'squad', 'platoon', 'company', 'slot'] as const;
function normalizeNode (node: Partial<Pick<Match, 'fireteam'|'squad'|'platoon'|'company'|'slot'>>) {
    for (const field of fields) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (node[field] ?? []).forEach(normalizeNode);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (node['reserved-for'] === 0) delete node['reserved-for'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (node.vehicletype === 0) delete node.vehicletype;
}

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
