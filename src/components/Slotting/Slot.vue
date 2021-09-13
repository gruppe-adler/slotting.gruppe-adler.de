<template>
    <li
        role="button"
        class="slot"
        :aria-label="$t('slotInto', { slot: model.description.length > 0 ? model.description : model.shortcode })"
    >
        <div></div>
        <span class="grad-tooltip" :style="`--grad-tooltip: '${model.description}'`" aria-hidden="true">{{ model.shortcode }}</span>
    </li>
</template>

<script lang="ts">
import type { Slot } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// TODO: Property reservedFor
// TODO: Property minSlottedPlayerCount

@Options({})
export default class SlotVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Slot;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;

    private get reservedFor (): string|undefined {
        return this.model['reserved-for'] ?? this.parentReservedFor;
    }

    private get minSlottedPlayerCount (): number|undefined {
        return this.model['min-slotted-player-count'] ?? this.parentMinSlottedPlayerCount;
    }
}
</script>

<style lang="scss" scoped>
.slot {
    --slot-size: 2.25rem;

    &:first-child {
        --slot-size: 2.5rem;
    }

    display: flex;
    flex-direction: column;
    gap: .25rem;
    align-items: center;
    cursor: pointer;
    inline-size: max-content;
    color: var(--c-text-2);

    > div {
        block-size: var(--slot-size);
        inline-size: var(--slot-size);
        background-color: var(--c-surf-2);
        border-radius: 50%;
        box-shadow: inset var(--shadow-1);
        transition: box-shadow .2s ease-out;
        position: relative;

        &::before {
            border-radius: inherit;
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--c-surf-3);
            opacity: 0;
            transition: opacity .2s ease-out;
        }

        &:hover {
            box-shadow: inset var(--shadow-2);

            &::before {
                opacity: 1;
            }
        }
    }

    > span {
        padding: .1em .2em;
        border-radius: .25rem;
        transition: background-color .2s ease-out;
        inline-size: var(--slot-size);
        box-sizing: border-box;
        text-align: center;
        font-size: .9rem;

        &:hover {
            background-color: var(--c-surf-3);
        }
    }
}
</style>
<style lang="scss">
$size: 2.25rem;

li[data-group-type="fireteam"] .slot {
    // make sure first slot in fireteams isn't bigger
    &:first-child {
        --slot-size: 2.25rem;
    }

    // make sure slot in fireteams have correct background
    > div {
        background-color: var(--c-surf-1);
    }
}
</style>
