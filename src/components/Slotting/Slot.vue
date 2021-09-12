<template>
    <li
        role="button"
        :aria-label="$t('slotInto', { slot: model.description.length > 0 ? model.description : model.shortcode })"
    >
        <div></div>
        <span>{{ model.shortcode }}</span>
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
    width: max-content;
    color: var(--c-text-2);
    margin: .25rem;

    > div {
        width: 2.5rem;
        height: 2.5rem;
        background-color: var(--c-surf-4);
        border-radius: 1.5rem;
        box-shadow: inset 0 0 2px 0 rgb(0 0 0 / 20%);
    }

    > span {
        overflow: hidden;
        display: block;
        padding: .1em .2em;
        border-radius: .25rem;

        &:hover {
            background-color: red;
        }
    }
}
</style>
