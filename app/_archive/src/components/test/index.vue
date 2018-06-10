<template>
  <div class="container">
      <div class="title">{{title}}</div>
      <card><p>node rendered in slot</p></card>
  </div>
</template>

<script>
import card from '../card.vue';

export default {
    components: { card },

    props: {
        words: {
            type: String,
            required: true,
            default: 'unknown'
        }
    },

    data() {
        return {
            hello: 'hello'
        };
    },

    computed: {
        title() {
            return `${this.hello} ${this.words}`;
        }
    }
};
</script>

<style lang="less" scoped>
.title {
    color: #343536;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 100rpx 0;
}
</style>
