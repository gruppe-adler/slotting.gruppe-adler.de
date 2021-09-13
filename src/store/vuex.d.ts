// vuex.d.ts
import { Store } from 'vuex';
import State from './State';

declare module '@vue/runtime-core' {
    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
