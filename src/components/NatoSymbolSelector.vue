<template>
    <div class="grad-symbol-selector" @click="shown = !shown">
        <slot />
        <ul class="grad-symbol-selector__list" v-if="shown && editMode">
            <li v-for="(natoSymbol, i) in natoSymbols" :key="i" class="grad-symbol-selector__symbolContainer" @click="emitSymbolChange(natoSymbol)">
                <img :src="`/natosymbols/${natoSymbol}.svg`" class="grad-symbol-selector__symbol" >
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class NatoSymbolSelectorVue extends Vue {
    @Prop({ default: false, type: Boolean }) private editMode!: boolean;
    private shown = false;
    private natoSymbols = ['zeus', 'air', 'armor', 'art', 'hq', 'inf', 'maint', 'mech_inf', 'med', 'mortar', 'motor_inf', 'plane', 'recon', 'service', 'support', 'uav'];

    public mounted (): void {
        // TODO: Clipping is only calculated on first render. Window resize is not considered
        const select = this.$refs.natoSymbolSelectorVue as HTMLSpanElement;
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

    private emitSymbolChange (natosymbol: string) {
        this.$emit('symbolChange', natosymbol);
    }
}
</script>

<style lang="scss" scoped>
.grad-symbol-selector {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &__list {
        list-style-type: none;
        border-radius: .25rem;
        position: absolute;
        z-index: 2;
        padding: .25rem .5rem;
        transition: transform .15s ease-out;
        transform-origin: bottom center;
        transform: scale(0.9);
        top: -1.65rem;
        background: white;
        border: 1px solid black
    }

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
}
</style>
