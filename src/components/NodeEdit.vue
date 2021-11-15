<template>
    <div class="grad-node-edit">
        <slot />
        <div class="grad-node-edit__container" v-if="editMode" @click="prevent($event)">
            <NatoSymbolSelector @symbolChange="applySymbolChange($event)" :editMode="editMode" :model="model" />
            <div>
                <label for="callsign">Callsign</label><br />
                <input type="text" name="callsign" :value="model.callsign">
            </div>
            <div>
                <label for="frequency">Frequency</label><br />
                <input type="text" name="frequency">
            </div>
            <div>
                <label for="vehicle">Vehicle</label><br />
                <input type="text" name="vehicle" :value="model.vehicletype">
            </div>
            <div>
                <button>
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                </button><br />
                <button>
                    <font-awesome-icon icon="copy"></font-awesome-icon>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { Company } from '@/models';

@Options({})
export default class NodeEditVue extends Vue {
    @Prop({ default: false, type: Boolean }) private editMode!: boolean;
    @Prop({ required: true, type: Object }) private model!: Partial<Company & { company: Company[]; }>;

    public mounted (): void {
        // TODO: Clipping is only calculated on first render. Window resize is not considered
        const select = this.$refs.nodeEdit as HTMLSpanElement;
        if (!select) return;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { x: parentX } = select.parentElement!.getBoundingClientRect();

        const left = parentX + select.offsetLeft;
        const right = left + select.offsetWidth;

        if (left < 8) {
            select.style.top = 'initial';
            select.style.left = 'calc(100% + .25rem)';
            select.style.transformOrigin = 'center left';
            return;
        }

        if (right > document.body.scrollWidth - 8) {
            select.style.top = 'initial';
            select.style.right = 'calc(100% + .25rem)';
            select.style.transformOrigin = 'center right';
        }
    }

    private applySymbolChange (natoSymbol: string) {
        if (!this.editMode) return;
        this.model.natosymbol = natoSymbol;
    }

    private prevent (event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
}
</script>

<style lang="scss" scoped>
.grad-node-edit {
    display: grid;
    grid-template-columns: 1.75rem 1fr 1.75rem;
    column-gap:  .5rem;
    row-gap:  .5rem;
    grid-column: 1/4;
    position: relative;
    cursor: pointer;
    &__container {
        visibility: hidden;
        cursor: initial;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        column-gap: .5rem;
        position: absolute;
        z-index: 2;
        padding: .5rem .5rem;
        transition: transform .15s ease-out;
        transform-origin: bottom center;
        border: 1px solid black;
        width: fit-content;
        top: 2.25rem;
        background: #fff;
    }
    &:hover > &__container,
    &:focus > &__container,
    &:focus-within > &__container {
        visibility: visible;
    }
}
</style>
