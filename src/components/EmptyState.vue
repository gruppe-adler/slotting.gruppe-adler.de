<template>
    <section class="grad-empty-state">
        <div class="grad-empty-state__icons">
            <font-awesome-icon
                v-for="(icon, i) in icons"
                :icon="icon"
                :key="i"
                size="3x"
            />
        </div>
        <span class="grad-empty-state__title">{{title}}</span>
        <span class="grad-empty-state__description">{{description}}</span>
        <ForumButton
            v-if="button!==''"
            :primary="true"
            class="grad-empty-state__button"
            :icon="buttonIcon"
            :text="button"
            @click="$emit('click')"
        />
    </section>
</template>

<script lang="ts">
import ForumButtonVue from '@/components/ForumButton.vue';

export default {
    components: { ForumButton: ForumButtonVue },
    props: {
        icons: {
            type: Array,
            default: (): string[] => []
        },
        iconStyle: {
            type: String,
            default: 'grey--text'
        },
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        button: {
            type: String,
            default: ''
        },
        buttonIcon: {
            type: String,
            default: ''
        }
    }
};
</script>

<style scoped lang="scss">
.grad-empty-state {
    width: auto;
    max-width: 100%;
    text-align: center;
    display: flex;
    row-gap: .5em;;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__icons {
        display: flex;
        column-gap: .25rem;
        margin-bottom: 1em;
        color: var(--c-text-3);
    }

    &__title {
        color: var(--c-text-1);
        font-size: 1.75em;
    }

    &__description {
        color: var(--c-text-2);
    }

    &__button {
        margin-top: 1rem;
    }
}
</style>
