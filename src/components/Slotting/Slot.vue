<template>
    <li
        class="slot"
    >
        <Tooltip v-if="model.user" :text="model.user.username">
            <Avatar :user="model.user" class="slot__avatar" />
        </Tooltip>
        <Tooltip v-else-if="blockedText" :text="blockedText">
            <div class="slot__avatar" style="font-size: 0.9em;">
                <font-awesome-icon icon="lock"></font-awesome-icon>
            </div>
        </Tooltip>
        <button
            v-else
            class="slot__avatar"
            style="cursor: pointer;"
            :aria-label="$t('slotInto', { slot: model.description.length > 0 ? model.description : model.shortcode })"
        ></button>
        <Tooltip :text="model.description">
            <span aria-hidden="true" class="slot__text" :style="textStyle">{{ model.shortcode }}</span>
        </Tooltip>
    </li>
</template>

<script lang="ts">
import type { Slot } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AvatarVue from '@/components/Avatar.vue';

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
            const { count } = this.$store.state.statistics[this.matchID];

            if (this.minSlottedPlayerCount > count) {
                return this.$t('blockedMinSlottedPlayers', { count: this.minSlottedPlayerCount });
            }
        }
        return undefined;
    }

    // TODO: Hardcoding the values color values might aswell be the shittiest idea ever
    private get groupColor (): string|undefined {
        if (this.model.user === undefined) return;

        if (this.model.user.groupTitleArray?.length === undefined || this.model.user.groupTitleArray.length === 0) return;

        const group = this.model.user.groupTitleArray[0];

        switch (group) {
        case 'Adler':
            return '#D18D1f';
        case 'Stammspieler':
            return '#66AA66';
        case 'Gastspieler':
            return '#66AA66';
        case 'Führung':
            return '#8f1167';
        case 'Anwärter':
            return '#6CAACC';
        }
    }

    private get textStyle (): string|undefined {
        if (!this.$store.state.settings.showGroupColor) return;

        if (this.groupColor === undefined) return;

        return `--group-bg-color: ${this.groupColor}; --group-color: white;`;
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
        block-size: var(--slot-size);
        inline-size: var(--slot-size);
        background-color: var(--c-surf-2);
        border-radius: 50%;
        box-shadow: inset var(--shadow-1);
        transition: box-shadow .2s ease-out;
        position: relative;
        border: none;

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
        transition: all .2s ease-out;
        inline-size: var(--slot-size);
        box-sizing: content-box;
        text-align: center;
        font-size: .9rem;
        background-color: var(--group-bg-color, transparent);
        color: var(--group-color, var(--c-text-2));

        &:hover {
            background-color: var(--c-surf-3);
        }
    }
}
</style>
<style lang="scss">
$size: 2.25rem;

.group.group--fireteam .slot {
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
