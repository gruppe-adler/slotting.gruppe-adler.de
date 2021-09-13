<template>
    <li class="group" :style="sideColorCSS">
        <div
            class="group__symbol grad-tooltip"
            role="image"
            v-if="model.natosymbol || model.vehicletype"
            :data-group-type="model.natosymbol"
            :style="`--grad-tooltip: '${model.vehicletype}'`"
        ></div>
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: var(--c-surf-2) 1px solid;
    padding-block-start: .75rem;
    border-radius: .25rem;
    box-shadow: var(--shadow-1);
}

li[data-group-type="company"],
li[data-group-type="platoon"] {
    border-top: .2rem solid var(--side-color, #d18d1f);
    row-gap: .5rem;
    padding-block-end: .75rem;
    padding-inline-end: .75rem;
    padding-inline-start: .75rem;

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
    position: absolute;
    inset-block-start: 0.5rem;
    inset-inline-start: 0.75rem;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid' width='60' height='40' viewBox='0 0 60 40'%3E%3Cdefs%3E%3Cstyle%3E.cls-1{fill:%23000;fill-rule:evenodd}%3C/style%3E%3C/defs%3E%3Cpath d='M58.738 40l-.044.067-.102-.067H1.408l-.102.067L1.262 40H0V0h1.262l.044-.067.102.067h57.184l.102-.067.044.067H60v40h-1.262zM58 2.783L31.82 20 58 37.217V2.783zM55.551 38L30 21.197 4.449 38h51.102zM2 37.217L28.18 20 2 2.783v34.434zM4.449 2L30 18.803 55.551 2H4.449z' class='cls-1'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.group__callsign {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    line-height: 2rem;
    color: var(--c-text-1);
}

</style>
