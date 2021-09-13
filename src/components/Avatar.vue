<template>
    <img
        v-if="picture !== ''"
        :src="picture"
        :alt="alt"
    />
    <div v-else :style="`background-color: ${user['icon:bgColor']}`" :aria-label="alt" role="image">
        <span aria-hidden="false">{{ user['icon:text'] }}</span>
    </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { User } from '@/models';
import { FORUM_URI } from '@/services';

@Options({})
export default class AvatarVue extends Vue {
    @Prop({ required: true, type: Object }) private user!: User;

    private get picture (): string {
        if (this.user.picture === null) return '';
        if (this.user.picture.startsWith('/')) {
            return `${FORUM_URI}${this.user.picture}`;
        }

        return this.user.picture;
    }

    private get alt (): string {
        return this.$t('avatarOf', { username: this.user.username });
    }
}
</script>

<style lang="scss" scoped>
img, div {
    width: 1em;
    height: 1em;
    border-radius: 0.5em;
    color: white;
}

div {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    > span {
        color: white;
    }
}
</style>
