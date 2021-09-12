<template>
    <li class="group">
        <img
            class="group__symbol"
            v-if="model.natosymbol || model.vehicletype"
            :data-group-type="model.natosymbol"
        />
        <span class="group__callsign" v-if="model.callsign">{{ model.callsign }}</span>
        <ul v-if="model.slot && model.slot.length > 0" data-group-type="slot">
            <Slot
                v-for="(s, i) in model.slot"
                :key="i"
                :model="s"
                :parentReservedFor="reservedFor"
                :parentMinSlottedPlayerCount="minSlottedPlayerCount"
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

// TODO: proerty side
// TODO: proerty vehicletype

@Options({
    components: {
        Slot: SlotVue
    }
})
export default class NodeVue extends Vue {
    @Prop({ required: true, type: Object }) private model!: Partial<Company & { company: Company[]; }>;
    @Prop({ type: String }) private parentReservedFor?: string;
    @Prop({ type: Number }) private parentMinSlottedPlayerCount?: number;

    private fields = ['company', 'platoon', 'squad', 'fireteam'];

    private get reservedFor (): string|undefined {
        return this.model['reserved-for'] ?? this.parentReservedFor;
    }

    private get minSlottedPlayerCount (): number|undefined {
        return this.model['min-slotted-player-count'] ?? this.parentMinSlottedPlayerCount;
    }
}
</script>

<style lang="scss" scoped>
ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    &[data-group-type="slot"] {
        display: flex;

        // not allowed inside fireteams
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
        display: flex;
        column-gap: 1.5rem;
        background-color: red;
        border-end-end-radius: inherit;
        border-end-start-radius: inherit;

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
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;

        // not allowed inside squads
        ul[data-group-type="company"],
        ul[data-group-type="platoon"],
        ul[data-group-type="squad"] {
            display: none;
        }
    }

    &[data-group-type="platoon"] {
        // not allowed inside platoons
        ul[data-group-type="company"],
        ul[data-group-type="platoon"] {
            display: none;
        }
    }

    &[data-group-type="company"] {
        // not allowed inside companys
        ul[data-group-type="company"] {
            display: none;
        }
    }

}
li[data-group-type="company"],
li[data-group-type="platoon"],
li[data-group-type="squad"] {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: red 1px solid;
    padding: .5rem 0 0 0;
    margin: .5rem;
    border-radius: .5rem;
}

.group__symbol {
    width: 2rem;
    height: 2rem;
    position: absolute;
    inset-block-start: .5rem;
    inset-inline-start: .5rem;
}

.group__callsign {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    line-height: 2rem;
    color: var(--c-text-1);
}

</style>
