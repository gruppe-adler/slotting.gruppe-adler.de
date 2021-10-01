<template>
    <li :style="sideColorCSS">
        <Tooltip :text="model.vehicletype" v-if="model.natosymbol || model.vehicletype" style="grid-column: 1"><div class="group__symbolContainer"><img :src="`/natosymbols/${model.natosymbol}.svg`" class="group__symbol"></div>
        </Tooltip>
        <span class="group__callsign" v-if="model.callsign">{{ model.callsign }}</span>
        <ul v-if="model.slot && model.slot.length > 0" class="group-wrapper group-wrapper--slot">
            <Slot
                v-for="(s, i) in model.slot"
                :key="i"
                :model="s"
                :parentReservedFor="reservedFor"
                :parentMinSlottedPlayerCount="minSlottedPlayerCount"
                :matchID="matchID"
            />
        </ul>
        <template v-for="(field, i) in fields">
            <ul
                v-if="model[field] && model[field].length > 0"
                :key="`${field}-${i}`"
                :class="`group-wrapper group-wrapper--${field}`"
            >
                <Node
                    v-for="(node, i) in model[field]"
                    :key="i"
                    :model="node"
                    :parentReservedFor="reservedFor"
                    :parentMinSlottedPlayerCount="minSlottedPlayerCount"
                    :class="`group group--${field}`"
                    :matchID="matchID"
                />
            </ul>
        </template>
    </li>
</template>

<script lang="ts">
import { Company } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SlotVue from './Slot.vue';

@Options({
    components: {
        Slot: SlotVue
    }
})
export default class NodeVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Partial<Company & { company: Company[]; }>;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;
    @Prop({ required: true, type: String }) private matchID!: string;

    private fields = ['company', 'platoon', 'squad', 'fireteam'];

    private get reservedFor (): string|undefined {
        return this.model['reserved-for'] ?? this.parentReservedFor;
    }

    private get minSlottedPlayerCount (): number|undefined {
        return this.model['min-slotted-player-count'] ?? this.parentMinSlottedPlayerCount;
    }

    private get sideColorCSS (): string|undefined {
        let color: string|null = null;
        switch (this.model.side) {
        case 'blufor':
            color = '#004c9a';
            break;
        case 'opfor':
            color = '#800000';
            break;
        case 'independent':
            color = '#6a6';
            break;
        case 'civilian':
            color = '#8f1167';
            break;
        }

        if (color === null) return undefined;

        return `--side-color: ${color}`;
    }
}
</script>

<style lang="scss" scoped>
.group-wrapper {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;

    &#{&}--slot {
        gap: .375rem;
        padding-inline: 1rem;
        padding-block: .5rem;
        justify-content: center;
        align-items: flex-end;
    }

    &#{&}--fireteam {
        background-color: var(--c-surf-2);
        margin-block: 0 -0.75rem;
        margin-inline: -0.75rem;
        border-end-end-radius: .15rem;
        border-end-start-radius: .15rem;
        justify-content: center;
    }

    &#{&}--squad {
        gap: .5rem;
        justify-content: center;
        align-items: center;
    }

    &#{&}--company,
    &#{&}--platoon {
        flex-direction: column;
        gap: 1rem;
    }
}

.group {
    &__symbol {
        block-size: 1.75rem;
        inline-size: 1.75rem;
        cursor: pointer;
        opacity: 0.7;
    }

    &__symbol:hover {
        opacity: 1;
    }

    &__symbolContainer {
        padding: 4px 8px 0 8px;
        border-radius: 100px;
    };

    &__symbolContainer:hover {
        background: rgba(0,0,0,0.1);
    };

    &__callsign {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.9rem;
        line-height: 2rem;
        color: var(--c-text-1);
        justify-self: center;
    }

    // general layout of companies, platoons and squads
    &#{&}--company,
    &#{&}--platoon,
    &#{&}--squad {
        display: grid;
        grid-template-columns: 1.75rem 1fr 1.75rem;
        column-gap:  .5rem;
        flex-direction: column;
        align-items: center;
        border: var(--c-surf-2) 1px solid;
        border-radius: .25rem;
        box-shadow: var(--shadow-1);
        padding: .75rem;

        > ul {
            grid-column: 1 / 4;
        }
    }

    // platoons and companies have a colored top
    // border & callsign to indicate the side
    &#{&}--company,
    &#{&}--platoon {
        border-block-start: .2rem solid var(--side-color, #d18d1f);
        row-gap: .5rem;

        > .group__callsign {
            color: var(--side-color, #d18d1f);
        }
    }

    // elements not allowed inside slots
    &#{&}--slot {
        > .group__callsign,
        > .group__symbol,
        > .group-wrapper.group-wrapper--company,
        > .group-wrapper.group-wrapper--platoon,
        > .group-wrapper.group-wrapper--squad,
        > .group-wrapper.group-wrapper--fireteam,
        > .group-wrapper.group-wrapper--slot {
            display: none;
        }
    }

    // elements not allowed inside fireteams
    &#{&}--fireteam {
        > .group__callsign,
        > .group__symbol,
        > .group-wrapper.group-wrapper--company,
        > .group-wrapper.group-wrapper--platoon,
        > .group-wrapper.group-wrapper--squad,
        > .group-wrapper.group-wrapper--fireteam {
            display: none;
        }
    }

    // elements not allowed inside squads
    &#{&}--squad {
        > .group-wrapper.group-wrapper--company,
        > .group-wrapper.group-wrapper--platoon,
        > .group-wrapper.group-wrapper--squad {
            display: none;
        }
    }

    // elements not allowed inside platoons
    &#{&}--platoon {
        > .group-wrapper.group-wrapper--company,
        > .group-wrapper.group-wrapper--platoon,
        > .group-wrapper.group-wrapper--fireteam {
            display: none;
        }
    }

    // elements not allowed inside companies
    &#{&}--company {
        > .group-wrapper.group-wrapper--company,
        > .group-wrapper.group-wrapper--fireteam {
            display: none;
        }
    }
}
</style>
