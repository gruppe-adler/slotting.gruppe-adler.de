import { Match } from '@/models';
import { loadSettings, Settings, saveSettings, addEventListener } from '@/services/settings';
import { createStore } from 'vuex';
import State, { SlotStatistic } from './State';

const STORE = createStore<State>({
    state: {
        matches: [],
        statistics: {},
        settings: loadSettings(),
        currentGroup: ''
    },
    mutations: {
        setMatches (state, matches: Match[]) { state.matches = matches; },
        setStatistics (state, { matchId, statistic }: { matchId: string, statistic: SlotStatistic }) { state.statistics[matchId] = statistic; },
        setCurrentGroup (state, group: string) { state.currentGroup = group; },
        setSettings (state, value: Partial<Settings>) { state.settings = { ...state.settings, ...value }; saveSettings(state.settings); }
    },
    actions: {
        async setMatches ({ commit }, matches: Match[]) {
            for (const match of matches) {
                commit('setStatistics', { matchId: match.uuid, statistic: calcStatistics(match) });
            }

            commit('setMatches', matches);
        }
    },
    modules: {}
});

addEventListener(({ detail: settings }) => {
    STORE.commit('setSettings', settings);
});

export default STORE;

const fields = ['fireteam', 'squad', 'platoon', 'company'] as const;

/**
 * Recursively calculate statistics of node
 * @param ctx Node
 * @returns Statistics
 */
function calcStatistics (ctx: Partial<Pick<Match, 'fireteam'|'squad'|'platoon'|'company'|'slot'>>): SlotStatistic {
    let count = 0;
    let max = 0;

    for (const field of fields) {
        const statistics = (ctx[field] ?? []).map(calcStatistics);
        for (const s of statistics) {
            count += s.count;
            max += s.max;
        }
    }

    max += ctx.slot?.length ?? 0;
    count += ctx.slot?.filter(s => s.user).length ?? 0;

    return { count, max };
}
