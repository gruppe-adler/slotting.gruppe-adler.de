import { Match, User } from '@/models';
import { loadSettings, Settings, saveSettings, addEventListener } from '@/services/settings';
import { fetchMatches, fetchMatch } from '@/services/slotting';
import { equalUsers } from '@/services/utils/user';
import WebSocketService from '@/services/websocket';
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
        setSlottedUser (state, options: { matchUUID: string, slotUUID: string, user?: User }) {
            const match = state.matches[options.matchUUID];
            if (match === undefined) return;

            const user = options.user;
            match.updateSlotUser(options.slotUUID, user);

            if (user === undefined) return;

            // TODO: Slotted count does not update :(

            // remove user from slot he is currently on
            for (const [, slot] of match.allSlots) {
                if (slot.uuid === options.slotUUID) continue;
                if (slot.user === undefined) continue;

                if (equalUsers(slot.user, user)) {
                    match.updateSlotUser(slot.uuid);
                }
            }
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
        },
        slotUser ({ commit }, options: { matchUUID: string, slotUUID: string, user?: User }) {
            commit('setSlottedUser', options);
        }
    },
    modules: {}
});

// eslint-disable-next-line no-new
new WebSocketService(STORE);

addEventListener(({ detail: settings }) => {
    STORE.commit('setSettings', settings);
});

export default STORE;
