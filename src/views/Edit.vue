<template>
    <main>
        <label>
            <input type="checkbox" role="switch" v-model="showXMLEditor" />
            <span>{{ $t('XMLEditor') }}</span>
        </label>
        <ForumButton
            icon="times"
            :text="$t('cancel')"
            @click="cancelEdit"
        />
        <ForumButton
            icon="save"
            :text="$t('saveChanges')"
            :primary="true"
        />
        <textarea v-if="showXMLEditor" v-model="xml"></textarea>
        <Match v-else-if="match !== undefined" :model="match" />
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
import { jsonToXML } from '@/services/utils/edit';

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
        this.$store.dispatch('loadMatches', topicID).then(() => {
            const matches = this.$store.state.matches;
            const matchTmp = matches.find(match => match.uuid === getMatchID());
            if (matchTmp !== undefined) this.match = matchTmp;
        });
    }

    @Watch('showXMLEditor')
    private processXML (value: boolean) {
        if (value) {
            this.xml = jsonToXML(this.parseMatchForXml({ ...this.match }), 'match');
        }
    }

    private cancelEdit () {
        this.$router.push({ path: '/slotting', query: { tid: getTopicID() } });
    }

    private parseMatchForXml (rawMatch: any): any {
        function recurse (match: any): any {
            ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {
                if (match[currentFilter] && match[currentFilter].length > 0) {
                    match[currentFilter].forEach((current: any) => {
                        if (current.user) {
                            delete current.user;
                        }
                        delete current.slottedPlayerCount;
                        recurse(current);
                    });
                }
            });

            return match;
        }
        delete rawMatch.slottedPlayerCount;
        return recurse(rawMatch);
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
textarea{
    height: 100%;
    width: 100%;
}
</style>
