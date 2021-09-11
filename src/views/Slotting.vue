<template>
    <main>
        <label>
            <input type="checkbox" role="switch" />
            <span>Gruppenfarbe anzeigen</span>
        </label>
        <template v-if="matches.length > 0">
           <Match v-for="m in matches" :match="m" :key="m.id" />
        </template>
        <section v-else></section>
        <ForumButton
            icon="sitemap"
            title="Match erstellen"
            text="Match erstellen"
            @click="createMatch"
        />
        <ForumButton
            icon="external-link-alt"
            title="In neuem Tab öffnen"
            text="In neuem Tab öffnen"
            style="float: right"
            @click="openInNewTab"
        />
    </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ForumButton from '@/components/ForumButton.vue';
import { Match } from '@/models';

@Options({
    components: {
        ForumButton: ForumButton
    }
})
export default class SlottingVie extends Vue {
    private matches: Match[] = [];

    public created () {
        // TODO: Load matches
    }

    private openInNewTab () {
        // TODO
    }

    private createMatch () {
        // TODO
    }
}
</script>

<style lang="scss" scoped>
label {
    cursor: pointer;
    padding: .5em .25em;
    display: inline-flex;
    align-items: center;
    user-select: none;

    &:focus, &:hover {
        background-color: var(--c-surf-4);
    }
}
</style>
