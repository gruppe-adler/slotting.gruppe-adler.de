<template>
    <main v-if="error">
        <!-- TODO: Error has to be pretty -->
        {{ error }}
    </main>
    <main
        v-else-if="loading"
        aria-busy="true"
        style="padding: 2rem; display: flex; justify-content: center;"
    >
        <Loader />
    </main>
    <main v-else>
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
        <Match v-else :model="match" :editMode="true" />
        <aside></aside>
    </main>
</template>

<script lang="ts">
import { getMatchID, getTopicID } from '@/services/slotting';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import MatchVue from '@/components/Slotting/Match.vue';
import ForumButton from '@/components/ForumButton.vue';
import { jsonToXML, parseXML } from '@/services/utils/edit';
import { Match } from '@/models';

@Options({
    components: {
        Match: MatchVue,
        ForumButton: ForumButton
    }
})
export default class EditView extends Vue {
    private error: Error|null = null;
    private loading = true;
    private match: Match|null = null;
    private showXMLEditor = false;
    private xml = '';

    public created (): void {
        this.$store.dispatch('loadMatches', getTopicID())
            .catch(err => { this.error = err; })
            .then(() => {
                const match = this.$store.state.matches?.find(m => m.uuid === getMatchID()) ?? null;
                if (match === null) return;

                this.match = JSON.parse(JSON.stringify(match));
            })
            .finally(() => { this.loading = false; });
    }

    @Watch('showXMLEditor')
    private processXML (value: boolean) {
        if (this.match === null) return;

        if (value) {
            this.xml = jsonToXML(this.match, 'match');
        } else {
            this.match = parseXML(this.xml) as unknown as Match;
        }
    }

    private cancelEdit () {
        this.$router.push({ path: '/slotting', query: { tid: getTopicID() } });
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
    height: 750px;
}
</style>
