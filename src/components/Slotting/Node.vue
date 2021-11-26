<template>
    <li :style="sideColorCSS">
        <NodeEdit :model="model" :editMode="editMode" v-if="model.uuid === undefined" @delete="$emit('delete')" @clone="$emit('clone')">
            <Tooltip :text="model.vehicletype" v-if="(model.natosymbol || model.vehicletype)" style="grid-column: 1">
                <img :src="`/natosymbols/${model.natosymbol}.svg`" class="group__symbol">
            </Tooltip>
            <span class="group__callsign" v-if="model.callsign">{{ model.callsign }}</span>
            <span v-if="model.frequency !== undefined" style="font-size: .75rem; display: flex; align-items: center; justify-content: center;">{{ model.frequency }}<br>MHz</span>
        </NodeEdit>
        <ul v-if="editMode && field || model.slot && model.slot.length > 0" class="group-wrapper group-wrapper--slot">
                <Slot
                    v-for="(s, i) in model.slot"
                    :key="i"
                    :model="s"
                    :parentReservedFor="reservedFor"
                    :parentMinSlottedPlayerCount="minSlottedPlayerCount"
                    :matchID="matchID"
                />
            <li v-if="editMode">
                <button  class="group-wrapper__addslot" @click="addSlot()">
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                </button>
            </li>
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
                    :editMode="editMode"
                    @delete="deleteChild(i, field)"
                    @clone="cloneChild(node, i, field)"
                />
            </ul>
        </template>
    </li>
</template>

<script lang="ts">
import { Company, Platoon, Squad, FireTeam, IMatch, Slot } from '@/models';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { v4 as uuidv4 } from 'uuid';
import NodeEditVue from '../NodeEdit.vue';
import SlotVue from './Slot.vue';

interface FieldMap {
    company: Company;
    platoon: Platoon;
    squad: Squad;
    fireteam: FireTeam;
}

@Options({
    components: {
        Slot: SlotVue,
        NodeEdit: NodeEditVue
    }
})
export default class NodeVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Partial<Company & { company: Company[]; }>;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;
    @Prop({ required: true, type: String }) private matchID!: string;
    @Prop({ default: false, type: Boolean }) private editMode!: boolean;

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

    private addSlot () {
        if (this.model === undefined || this.model?.slot === undefined) return;
        this.model.slot.push({ description: 'Rifleman', shortcode: 'R', uuid: '1337' });
    }

    private deleteChild (i: number, field: 'company'|'platoon'|'squad'|'fireteam') {
        return this.model[field]?.splice(i, 1);
    }

    private cloneChild<T extends keyof FieldMap> (node: FieldMap[T], i: number, field: T) {
        const nodeClone = JSON.parse(JSON.stringify(node));
        this.traverseSlots(nodeClone, (s: Slot) => {
            delete s.user;
            s.uuid = uuidv4();
        });
        return this.model[field]?.splice(i, 0, nodeClone);
    }

    private traverseSlots (ctx: Partial<Pick<IMatch, 'fireteam'|'squad'|'platoon'|'company'|'slot'>>, callback: (s: Slot) => unknown) {
        for (const field of ['fireteam', 'squad', 'platoon', 'company'] as const) {
            if (ctx[field] === undefined) continue;

            // We literally checked this in the line above
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ctx[field]!.forEach(e => this.traverseSlots(e, callback));
        }

        if (!ctx.slot) return;

        ctx.slot.forEach(callback);
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
        padding-inline: 1rem;
        padding-block: 0.5rem;
        gap: 1rem;
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

    &__addslot {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 1000px;
        border: none;
        opacity: 0;
        cursor: pointer;
        transition: opacity .15s ease-out;
    }

    &:hover > li > &__addslot,
    &:focus > li > &__addslot,
    &:focus-within > li > &__addslot {
        opacity: 1;
    }
}

.group {
    &__symbol {
        block-size: 1.75rem;
        inline-size: 1.75rem;
        opacity: 0.7;
    }

    &__callsign {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.9rem;
        line-height: 2rem;
        color: var(--c-text-1);
        justify-self: center;
        align-self: center;
    }

    // general layout of companies, platoons and squads
    &#{&}--company,
    &#{&}--platoon,
    &#{&}--squad {
        display: grid;
        // grid-template-columns: 1.75rem 1fr 1.75rem;
        column-gap:  .5rem;
        row-gap:  .5rem;
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
    &#{&}--platoon {
        border-block-start: .2rem solid var(--side-color, #d18d1f);
        row-gap: .5rem;

        > .group__callsign {
            color: var(--side-color, #d18d1f);
        }
    }

    &#{&}--company {
        border-block-start: .2rem solid var(--side-color, #8f1167);
        row-gap: .5rem;

        > .group__callsign {
            color: var(--side-color, #8f1167);
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
