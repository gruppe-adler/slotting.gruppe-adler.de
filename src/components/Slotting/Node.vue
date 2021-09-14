<template>
    <li class="group" :style="sideColorCSS">
        <Tooltip :text="model.vehicletype" v-if="model.natosymbol || model.vehicletype" style="grid-column: 1">
            <img :src="`/natosymbols/${model.natosymbol}.svg`" class="group__symbol">
        </Tooltip>
        <span class="group__callsign" v-if="model.callsign">{{ model.callsign }}</span>
        <ul v-if="model.slot && model.slot.length > 0" data-group-type="slot">
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
                :data-group-type="field"
            >
                <Node
                    v-for="(node, i) in model[field]"
                    :key="i"
                    :model="node"
                    :parentReservedFor="reservedFor"
                    :parentMinSlottedPlayerCount="minSlottedPlayerCount"
                    :data-group-type="field"
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
ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;

    &[data-group-type="slot"] {
        gap: .375rem;
        padding-inline: 1rem;
        padding-block-start: .5rem;
        padding-block-end: .5rem;
        justify-content: center;
        align-items: flex-end;

        // not allowed inside slots
        .group__callsign,
        .group__symbol,
        ul[data-group-type="company"],
        ul[data-group-type="platoon"],
        ul[data-group-type="squad"],
        ul[data-group-type="fireteam"],
        ul[data-group-type="slot"] {
            display: none;
        }
    }

    &[data-group-type="fireteam"] {
        background-color: var(--c-surf-2);
        margin: 0 -0.75rem -0.75rem -0.75rem;
        border-end-end-radius: .15rem;
        border-end-start-radius: .15rem;
        justify-content: center;

        // not allowed inside fireteams
        .group__callsign,
        .group__symbol,
        ul[data-group-type="company"],
        ul[data-group-type="platoon"],
        ul[data-group-type="squad"],
        ul[data-group-type="fireteam"] {
            display: none;
        }
    }

    &[data-group-type="squad"] {
        gap: .5rem;
        justify-content: center;

        // not allowed inside squads
        ul[data-group-type="company"],
        ul[data-group-type="platoon"],
        ul[data-group-type="squad"] {
            display: none;
        }
    }

    &[data-group-type="platoon"] {
        flex-direction: column;
        gap: 1rem;

        // not allowed inside platoons
        ul[data-group-type="company"],
        ul[data-group-type="platoon"] {
            display: none;
        }
    }

    &[data-group-type="company"] {
        flex-direction: column;
        gap: 1rem;

        // not allowed inside companys
        ul[data-group-type="company"] {
            display: none;
        }
    }
}

li[data-group-type="company"],
li[data-group-type="platoon"],
li[data-group-type="squad"] {
    display: grid;
    grid-template-columns: 1.75rem 1fr 1.75rem;
    column-gap:  .5rem;
    flex-direction: column;
    align-items: center;
    border: var(--c-surf-2) 1px solid;
    border-radius: .25rem;
    box-shadow: var(--shadow-1);
    padding: .75rem;

    > *:not(.group__callsign) {
        grid-column: 1 / 4;
    }
}

li[data-group-type="company"],
li[data-group-type="platoon"] {
    border-top: .2rem solid var(--side-color, #d18d1f);
    row-gap: .5rem;

    .group__callsign {
        color: var(--side-color, #d18d1f);
    }
}

li[data-group-type="squad"] {
    .group__callsign {
        color: var(--c-text-1);
    }
}

.group__symbol {
    block-size: 1.75rem;
    inline-size: 1.75rem;
}

.group__callsign {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    line-height: 2rem;
    color: var(--c-text-1);
    justify-self: center;
}

</style>
