import { User } from '@/models';
import State from '@/store/State';
import { io, Socket } from 'socket.io-client';
import { Store } from 'vuex';
import { FORUM_URI } from '.';

// Pulled from https://github.com/gruppe-adler/nodebb-plugin-arma3-slotting
interface SlottingWSEventMap {
    'event:match-changed': (data: { tid: number, matchid: string }) => unknown;
    'event:user-slotted': (data: { tid: number, matchid: string, slot: string, user: User }) => unknown;
    'event:user-unslotted': (data: { tid: number, matchid: string, slot: string }) => unknown;
}

class WebSocketService {
    private store: Store<State>;
    private socket: Socket<SlottingWSEventMap>;

    constructor (store: Store<State>) {
        this.store = store;
        this.socket = io(`${FORUM_URI}/slotting`);
        this.setupSocketHandlers();
    }

    private setupSocketHandlers () {
        this.socket.on('connect', () => {
            // TODO
        });

        this.socket.on('event:match-changed', async ({ tid, matchid }) => {
            this.store.dispatch('loadMatch', { tid, matchUUID: matchid });
        });

        this.socket.on('event:user-slotted', async ({ matchid, slot, user }) => {
            this.store.dispatch('slotUser', {
                matchUUID: matchid,
                slotUUID: slot,
                user
            });
        });

        this.socket.on('event:user-unslotted', async ({ matchid, slot }) => {
            this.store.dispatch('slotUser', {
                matchUUID: matchid,
                slotUUID: slot
            });
        });
    }
}

export default WebSocketService;
