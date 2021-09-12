<template>
    <li
        role="button"
        :aria-label="$t('slotInto', { slot: model.description.length > 0 ? model.description : model.shortcode })"
    >
        <div></div>
        <span class="grad-tooltip" :style="`--grad-tooltip: '${model.description}'`">{{ model.shortcode }}</span>
    </li>
</template>

<script lang="ts">
import type { Slot } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class SlotVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Slot;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;
}
</script>

<style lang="scss" scoped>
li {
    display: flex;
    flex-direction: column;
    gap: .25rem;
    align-items: center;
    cursor: pointer;
    inline-size: max-content;
    color: var(--c-text-2);
    margin: .25rem;

    > div {
        block-size: 2.5rem;
        inline-size: 2.5rem;
        background-color: var(--c-surf-2);
        border-radius: 1.5rem;
        box-shadow: inset var(--shadow-1);
        transition: box-shadow .2s ease-out;

        &:hover {
            box-shadow: var(--shadow-2);
        }
    }

    > span {
        padding: .1em .2em;
        border-radius: .25rem;
        transition: background-color .2s ease-out;
        inline-size: 2.5rem;
        box-sizing: border-box;
        text-align: center;

        &:hover {
            background-color: var(--c-surf-3);
        }
    }
}
</style>
<style lang="scss">
li[data-group-type="fireteam"] li > div {
        background-color: var(--c-surf-1);
}
</style>
