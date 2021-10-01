// TODO: Remove after update to socket.io-client v4
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from '@/models';
import State from '@/store/State';
// import { io, Socket } from 'socket.io-client';
// @ts-ignore
import io from 'socket.io-client';
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
    private socket: any;
    // private socket: Socket<SlottingWSEventMap>;

    constructor (store: Store<State>) {
        this.store = store;
        this.socket = io(`${FORUM_URI}/slotting`);
        this.setupSocketHandlers();
    }

    private setupSocketHandlers () {
        this.socket.on('connect', () => {
            // TODO
        });

        // @ts-ignore
        this.socket.on('event:match-changed', async ({ tid, matchid }) => {
            // TODO: Check if match is in current tid
            this.store.dispatch('loadMatch', { tid, matchUUID: matchid });
        });

        // @ts-ignore
        this.socket.on('event:user-slotted', async ({ matchid, slot, user }) => {
            this.store.dispatch('slotUser', {
                matchUUID: matchid,
                slotUUID: slot,
                user
            });
        });

        // @ts-ignore
        this.socket.on('event:user-unslotted', async ({ matchid, slot }) => {
            this.store.dispatch('slotUser', {
                matchUUID: matchid,
                slotUUID: slot
            });
        });
    }
}

export default WebSocketService;
