<template>
    <main v-if="error">
        <!-- TODO: Error has to be pretty -->
        {{ error }}
    </main>
    <main v-else-if="matches.length === 0">
        <!-- TODO: Add loader -->
        Loading...
    </main>
    <main v-else>
        <label>
            <input type="checkbox" role="switch" v-model="showGroupColor" />
            <span>{{ $t('showGroupColor') }}</span>
        </label>
        <Match v-for="m in matches" :model="m" :key="m.uuid" />
        <ForumButton
            icon="sitemap"
            :text="$t('createMatch')"
            @click="createMatch"
        />
        <ForumButton
            v-if="isInIFrame"
            icon="external-link-alt"
            :text="$t('openInNewTab')"
            style="float: right"
            @click="openInNewTab"
        />
    </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ForumButton from '@/components/ForumButton.vue';
import MatchVue from '@/components/Slotting/Match.vue';

@Options({
    components: {
        ForumButton: ForumButton,
        Match: MatchVue
    }
})
export default class SlottingView extends Vue {
    private error: Error|null = null;

    public created (): void {
        const q = this.$route.query.tid ?? '';
        const tid = (typeof q === 'object' ? q[0] : q) ?? '';

        this.$store.dispatch('loadMatches', tid).catch(err => { this.error = err; });
    }

    private openInNewTab () {
        window.open(window.location.href, '_blank');
    }

    private createMatch () {
        // TODO
    }

    private get isInIFrame (): boolean {
        return window !== window.parent;
    }

    private get matches () { return this.$store.state.matches; }
    private set matches (value) { this.$store.commit('setMatches', value); }

    private get showGroupColor () { return this.$store.state.settings.showGroupColor; }
    private set showGroupColor (value) { this.$store.commit('setSettings', { showGroupColor: value }); }
}
</script>

<style lang="scss" scoped>
label {
    cursor: pointer;
    font-size: 0.9rem;
    padding: .5em .25em;
    display: inline-flex;
    align-items: center;
    user-select: none;

    &:focus, &:hover {
        background-color: var(--c-surf-3);
    }
}
</style>
