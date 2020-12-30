<template>
  <swipe :autoplay="3000" indicator-color="white">
    <swipe-item v-for="n in 5" :key="n">
      <img :src="`https://picsum.photos/400/140?_=${n}`" alt="" />
    </swipe-item>
  </swipe>
  <grid class="py-4" :column-num="2" :gutter="16" clickable>
    <grid-item :to="{ name: 'Anime1' }">
      <van-image src="./images/anime1.png" class="w-16 h-16 mb-1" fit="contain" />
      <div>Anime1</div>
    </grid-item>
    <grid-item :to="{ name: 'Agefans' }">
      <van-image src="./images/agefans.jpg" class="w-16 h-16 mb-1" fit="contain" />
      <span>Age動漫</span>
    </grid-item>
  </grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Swipe, SwipeItem, Grid, GridItem, Image } from 'vant';

export default defineComponent({
  components: {
    Swipe,
    SwipeItem,
    Grid,
    GridItem,
    VanImage: Image,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
</style>

