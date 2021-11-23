<template>
    <div class="grad-node-edit" @click="shown = !shown">
        <slot />
        <div class="grad-node-edit__container" v-if="editMode" ref="nodeEdit" v-show="shown" @click="prevent($event)">
            <NatoSymbolSelector @symbolChange="applySymbolChange($event)" :editMode="editMode" :model="model" />
            <div>
                <label for="callsign">Callsign</label>
                <input type="text" name="callsign" v-model="model.callsign">
            </div>
            <div>
                <label for="frequency">Frequency</label>
                <input type="text" name="frequency">
            </div>
            <div>
                <label for="vehicle">Vehicle</label>
                <input type="text" name="vehicle" v-model="model.vehicletype">
            </div>
            <Tooltip text="Settings">
                <button>
                    <font-awesome-icon icon="sliders-h"></font-awesome-icon>
                </button>
            </Tooltip>
            <Tooltip text="Delete Node">
                <button @click="deleteNode()">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                </button>
            </Tooltip>
            <Tooltip text="Clone Node">
                <button @click="cloneNode()">
                    <font-awesome-icon icon="copy"></font-awesome-icon>
                </button>
            </Tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { Company, Match } from '@/models';
import { getMatchID } from '@/services/slotting';

@Options({
    components: { }
})
export default class NodeEditVue extends Vue {
    @Prop({ default: false, type: Boolean }) private editMode!: boolean;
    @Prop({ required: true, type: Object }) private model!: Partial<Company & { company: Company[]; }>;
    private shown = false;
    public mounted (): void {
        // TODO: Clipping is only calculated on first render. Window resize is not considered
        const nodeEdit = this.$refs.nodeEdit as HTMLSpanElement;
        if (!nodeEdit) return;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { x: parentX } = nodeEdit.parentElement!.getBoundingClientRect();

        const left = parentX + nodeEdit.offsetLeft;
        const right = left + nodeEdit.offsetWidth;

        if (left < 8) {
            nodeEdit.style.top = 'initial';
            nodeEdit.style.left = 'calc(100% + .25rem)';
            nodeEdit.style.transformOrigin = 'center left';
            return;
        }

        if (right > window.innerWidth - 8) {
            nodeEdit.style.top = 'initial';
            nodeEdit.style.right = 'calc(100% + .25rem)';
            nodeEdit.style.transformOrigin = 'center right';
        }
    }

    private applySymbolChange (natoSymbol: string) {
        if (!this.editMode) return;
        this.model.natosymbol = natoSymbol;
    }

    private prevent (event: MouseEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    private deleteNode () {
        this.$emit('delete');
    }

    private cloneNode () {
        this.$emit('clone');
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
        cursor: initial;
        display: grid;
        grid-template-columns: auto repeat(3, 1fr) repeat(3, 3rem);
        column-gap: .75rem;
        position: absolute;
        z-index: 2;
        padding: .5rem .5rem;
        transition: opacity .15s ease-out;
        transform-origin: bottom center;
        border: 1px solid black;
        width: min-content;
        top: 2.25rem;
        background: #fff;

        button {
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }
}
</style>
