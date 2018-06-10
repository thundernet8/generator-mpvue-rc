<template>
  <div>
    <p class="card">A card</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
    props: ['text']
};
</script>

<style>
.card {
    padding: 20rpx;
}
</style>
