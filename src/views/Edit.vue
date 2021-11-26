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
        <Node v-else :model="match" :editMode="true" style="display: flex; flex-direction: column; gap: 1rem;" :matchID="match.uuid" ref="slots" />
        <aside></aside>
    </main>
</template>

<script lang="ts">
import { getMatchID, getTopicID } from '@/services/slotting';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import NodeVue from '@/components/Slotting/Node.vue';
import ForumButton from '@/components/ForumButton.vue';
import { Match } from '@/models';
import LoaderVue from '@/components/Loader.vue';
import Sortable from 'sortablejs';

@Options({
    components: {
        Node: NodeVue,
        ForumButton: ForumButton,
        Loader: LoaderVue
    }
})
export default class EditView extends Vue {
    private error: Error|null = null;
    private loading = true;
    private match: Match|null = null;
    private showXMLEditor = false;
    private xml = '';

    public created (): void {
        const matchUUID = getMatchID();
        const tid = getTopicID();

        this.$store.dispatch('loadMatch', { tid, matchUUID })
            .catch(err => { this.error = err; })
            .then(() => {
                const match = this.$store.state.matches[matchUUID];
                if (match === undefined) return;

                this.match = match.clone();
            })
            .finally(() => { this.loading = false; });
    }

    @Watch('showXMLEditor')
    private processXML (value: boolean) {
        if (this.match === null) return;

        if (value) {
            this.xml = this.match.toXML();
        } else {
            this.match = Match.fromXML(this.xml);
        }
    }

    private cancelEdit () {
        this.$router.push({ path: '/slotting', query: { tid: getTopicID() } });
    }

    public updated (): void {
        if (this.match === null || this.$refs.slots === null) return;

        const slotsContainer = this.$refs.slots as NodeVue;

        for (const field of ['squad', 'fireteam', 'platoon', 'company', 'slot']) {
            const groupWrappers = slotsContainer.$el.querySelectorAll(`.group-wrapper.group-wrapper--${field}`);
            for (const wrapper of groupWrappers) {
                // eslint-disable-next-line no-new
                new Sortable(wrapper, { group: field, animation: 150 });
            }
        }
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
    min-height: 70em;
}
</style>
