<template>
    <main>
        <label>
            <input type="checkbox" role="switch" v-model="showXMLEditor" />
            <span>{{ $t('XMLEditor') }}</span>
        </label>
        <ForumButton
            icon="times"
            :text="$t('cancel')"
            @click="createMatch"
        />
        <ForumButton
            icon="save"
            :text="$t('saveChanges')"
            :primary="true"
        />
        <textarea v-if="showXMLEditor" v-model="xml"></textarea>
        <Match v-else :model="match" />
        <aside></aside>
    </main>
</template>

<script lang="ts">
import { getMatchID, getTopicID } from '@/services/slotting';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Match } from '@/models';
import MatchVue from '@/components/Slotting/Match.vue';
import ForumButton from '@/components/ForumButton.vue';

@Options({
    components: {
        Match: MatchVue,
        ForumButton: ForumButton
    }
})
export default class EditView extends Vue {
    private showXMLEditor = false;
    private xml = '';
    private match!: Match;

    public created (): void {
        const matchID = getMatchID();
        const topicID = getTopicID();

        if (topicID === '') this.$router.push('/');
        if (matchID === '') this.$router.push({ path: '/slotting', query: { tid: topicID } });

        // TODO: Load match
        this.match = {
            uuid: matchID,
            slot: [],
            platoon: [],
            company: [],
            fireteam: [],
            squad: [],
            slottedPlayerCount: 0
        };
    }

    @Watch('showXMLEditor')
    private processXML (value: boolean) {
        // TODO: match to / from xml
    }
}
</script>

<style lang="scss" scoped>
main {
    display: grid;
    grid-template:
        "inputs abort save" auto
        "slotlist shelf shelf" auto / 1fr auto auto;

    column-gap: .5rem;
    row-gap: 1rem;
}

aside {
    grid-area: shelf;
}
label {
    grid-area: inputs;
    cursor: pointer;
    font-size: 0.9rem;
    padding: .5em .25em;
    display: inline-flex;
    align-items: center;
    user-select: none;
    justify-self: flex-start;

    &:focus, &:hover {
        background-color: var(--c-surf-3);
    }
}
</style>
