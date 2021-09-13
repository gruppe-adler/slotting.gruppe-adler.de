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
import { Match } from '@/models';
import MatchVue from '@/components/Slotting/Match.vue';

import { getMatches } from '@/services/slotting';

@Options({
    components: {
        ForumButton: ForumButton,
        Match: MatchVue
    }
})
export default class SlottingView extends Vue {
    private matches: Match[] = [];
    private error: Error|null = null;
    private showGroupColor = false;

    public created (): void {
        const q = this.$route.query.tid ?? '';
        const tid = (typeof q === 'object' ? q[0] : q) ?? '';

        getMatches(tid).then(matches => {
            this.matches = matches;
            this.$store.dispatch('setMatches', matches);
            if (matches.length === 0) this.$router.push('/');
        }).catch(err => {
            this.error = err;
        });
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
