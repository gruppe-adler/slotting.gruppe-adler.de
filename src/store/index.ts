import { Match } from '@/models';
import { loadSettings, Settings, saveSettings, addEventListener } from '@/services/settings';
import { fetchMatches, fetchMatch } from '@/services/slotting';
import { createStore } from 'vuex';
import State from './State';

const STORE = createStore<State>({
    state: {
        matches: {},
        settings: loadSettings(),
        currentGroup: ''
    },
    mutations: {
        setMatch (state, match: Match) {
            state.matches[match.uuid] = match;
        },
        setCurrentGroup (state, group: string) { state.currentGroup = group; },
        setSettings (state, value: Partial<Settings>) { state.settings = { ...state.settings, ...value }; saveSettings(state.settings); }
    },
    actions: {
        async loadMatches ({ commit }, tid: string) {
            const matches = await fetchMatches(tid);

            for (const match of matches) {
                commit('setMatch', match);
            }
        },
        async loadMatch ({ commit }, { tid, matchUUID }: { tid: string, matchUUID: string }) {
            const match = await fetchMatch(tid, matchUUID);
            if (match === null) return;

            commit('setMatch', match);
        }
    },
    modules: {}
});

addEventListener(({ detail: settings }) => {
    STORE.commit('setSettings', settings);
});

export default STORE;
