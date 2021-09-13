<template>
    <li
        role="button"
        class="slot"
        :aria-label="$t('slotInto', { slot: model.description.length > 0 ? model.description : model.shortcode })"
    >
        <Tooltip v-if="model.user" :text="model.user.username">
            <Avatar :user="model.user" class="slot__avatar" />
        </Tooltip>
        <Tooltip v-else-if="blockedText" :text="blockedText">
            <div class="slot__avatar">
                <font-awesome-icon icon="lock"></font-awesome-icon>
            </div>
        </Tooltip>
        <div v-else class="slot__avatar"></div>
        <Tooltip :text="model.description">
            <span aria-hidden="true" class="slot__text">{{ model.shortcode }}</span>
        </Tooltip>
    </li>
</template>

<script lang="ts">
import type { Slot } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AvatarVue from '@/components/Avatar.vue';

// TODO: Property reservedFor
// TODO: Property minSlottedPlayerCount

@Options({
    components: {
        Avatar: AvatarVue
    }
})
export default class SlotVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Slot;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;
    @Prop({ required: true, type: String }) private matchID!: string;

    private get reservedFor (): string {
        return this.model['reserved-for'] ?? this.parentReservedFor ?? '';
    }

    private get minSlottedPlayerCount (): number|undefined {
        return this.model['min-slotted-player-count'] ?? this.parentMinSlottedPlayerCount;
    }

    private get blockedText (): string|undefined {
        if (this.reservedFor !== '') {
            const group = this.$store.state.currentGroup;

            if (group !== this.reservedFor) {
                return this.$t('blockedReservedFor', { name: this.reservedFor });
            }
        }

        if (this.minSlottedPlayerCount !== undefined) {
            const { count } = this.$store.state.slotStatistics[this.matchID];

            if (this.minSlottedPlayerCount > count) {
                return this.$t('blockedMinSlottedPlayers', { count: this.minSlottedPlayerCount });
            }
        }
        return undefined;
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
    inline-size: max-content;
    color: var(--c-text-2);

    &__avatar {
        cursor: pointer;
        block-size: var(--slot-size);
        inline-size: var(--slot-size);
        background-color: var(--c-surf-2);
        border-radius: 50%;
        box-shadow: inset var(--shadow-1);
        transition: box-shadow .2s ease-out;
        position: relative;

        @at-root {
            div#{&} {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--c-text-3);
            }
        }

        &::after {
            border-radius: inherit;
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--c-surf-3);
            opacity: 0;
            transition: opacity .2s ease-out;
            pointer-events: none;
        }

        &:hover {
            box-shadow: inset var(--shadow-2);

            &::after {
                opacity: 1;
            }
        }
    }

    &__text {
        user-select: none;
        padding: .1em 0;
        border-radius: .25rem;
        transition: background-color .2s ease-out;
        inline-size: var(--slot-size);
        box-sizing: content-box;
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
    &__avatar {
        background-color: var(--c-surf-1);
    }
}
</style>
