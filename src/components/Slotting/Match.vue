<template>
    <section>
        <span role="heading" aria-level="2">{{ $t('slotlistHeader', statistics) }}</span>
        <div ref="more">
            <button :aria-expanded="moreShown" @click="moreShown = !moreShown">
                <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
            </button>
            <ul role="region" :style="moreShown ? '' : 'transform: scale(0);'" @click="moreShown = false;">
                <li @click="editMatch" role="button">
                    <font-awesome-icon size="sm" icon="pencil-alt"></font-awesome-icon>
                    <span>{{ $t('edit') }}</span>
                </li>
                <li  @click="shareMatch" role="button">
                    <font-awesome-icon size="sm" icon="share"></font-awesome-icon>
                    <span>{{ $t('share') }}</span>
                </li>
                <li  @click="deleteMatch" role="button">
                    <font-awesome-icon size="sm" icon="trash-alt"></font-awesome-icon>
                    <span>{{ $t('delete') }}</span>
                </li>
            </ul>
        </div>
        <Node :model="model" style="grid-area: slots; display: flex; flex-direction: column; gap: 1rem;" :matchID="model.uuid" />
    </section>
</template>

<script lang="ts">
import { Match } from '@/models';
import { deleteMatch, getTopicID } from '@/services/slotting';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import NodeVue from './Node.vue';

@Options({
    components: {
        Node: NodeVue
    }
})
export default class MatchVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Match;
    private moreShown = false;
    private windowClick!: (event: MouseEvent) => void;

    public created (): void {
        this.windowClick = (event: MouseEvent) => {
            if (!this.moreShown) return;

            if (!this.$refs.more || !event.target) return;
            const target = event.target as HTMLElement;
            const moreMenu = this.$refs.more as HTMLDivElement;

            // we don't want to hide more menu, if user clicked on list / element within in list
            if (moreMenu === target || moreMenu.contains(target)) return;

            event.preventDefault();
            event.stopPropagation();

            this.moreShown = false;
        };
        window.addEventListener('click', this.windowClick, { capture: true });
    }

    public unmounted (): void {
        window.removeEventListener('click', this.windowClick, { capture: true });
    }

    private get statistics () {
        return this.$store.state.statistics[this.model.uuid] ?? { count: 0, max: 0 };
    }

    /**
     * Callback for edit button in more menu
     */
    private editMatch () {
        this.$router.push({ path: '/slotting/edit', query: { tid: getTopicID(), mid: this.model.uuid } });
        // TODO
    }

    /**
     * Callback for share button in more menu
     */
    private shareMatch () {
        // TODO
    }

    /**
     * Callback for delete button in more menu
     */
    private async deleteMatch () {
        await deleteMatch(getTopicID(), this.model.uuid);
    }
}
</script>

<style lang="scss" scoped>
section {
    display: grid;
    margin: 0 .5rem 1.5rem .5rem;
    gap: .5rem;
    grid-template:
        "heading more" auto
        "slots slots" auto / auto auto;
}

span[role="heading"] {
    font-size: .85rem;
    text-transform: uppercase;
    color: var(--c-text-3);
    grid-area: heading;
    align-self: flex-end;
}

div:first-of-type {
    position: relative;
    justify-self: flex-end;

    > ul {
        z-index: 2;
        transform-origin: top right;
        list-style-type: none;
        padding: .5rem 0;
        margin: 0;
        transition: transform .2s ease-out;
        background-color: var(--c-surf-1);
        border-radius: .5rem;
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        box-shadow: var(--shadow-2);

        > li {
            padding: .5rem 1rem;
            display: flex;
            gap: .5rem;
            cursor: pointer;

            &:hover {
                background-color: var(--c-surf-3);
            }
        }
    }

    > button {
        border: 0;
        background-color: transparent;
        cursor: pointer;
        padding: .5rem;
        color: var(--c-text-2);
    }
}
</style>
