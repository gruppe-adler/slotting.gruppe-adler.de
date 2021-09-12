<template>
    <button v-bind="$attrs">
        <font-awesome-icon
            v-if="icon.length > 0"
            :icon="icon"
            style="transform: scale(95%);"
        ></font-awesome-icon>
        <span v-if="text.length > 0">{{ text }}</span>
    </button>
</template>

<script lang="ts">
export default {
    props: {
        text: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: '#D18D1F'
        }
    }
};
</script>

<style lang="scss" scoped>
// TODO: Fix colors
button {
    color: #333;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 10px 16px;
    text-align: center;
    vertical-align: middle;
    padding: 10px 16px;
    font-size: 14px;
    line-height: 1.42857143;
    border-radius: 0;
    user-select: none;
    cursor: pointer;

    &:focus, &:hover {
        background-color: #e6e6e6;
        border-color: #adadad;
    }

    span:not(:only-child) {
        margin-inline-start: .25em;
    }
}
</style>
