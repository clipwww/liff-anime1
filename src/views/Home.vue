<template>
  <swipe :autoplay="3000" indicator-color="white">
    <swipe-item v-for="n in 5" :key="n">
      <img class="w-full" :src="`https://picsum.photos/1200/300?_=${n}`" alt="" />
    </swipe-item>
  </swipe>
  <grid class="py-4" :column-num="2" :gutter="16" clickable>
    <grid-item :to="{ name: 'Anime1' }">
      <van-image src="./images/anime1.png" class="w-20 h-20 mb-1" fit="contain" />
      <div class="text-sm">Anime1</div>
    </grid-item>
    <grid-item :to="{ name: 'Agefans' }">
      <van-image src="./images/agefans.jpg" class="w-20 h-20 mb-1" fit="contain" />
      <span class="text-sm">Age動漫</span>
    </grid-item>
    <grid-item :to="{ name: 'Himawari' }">
      <van-image src="./images/himawari.png" class="w-20 h-20 mb-1" fit="contain" />
      <span class="text-sm">向日葵動畫</span>
    </grid-item>
    <grid-item :to="{ name: 'UrlShare' }">
      <Icon name="share" size="5rem" class="mb-1" />
      <span class="text-sm">???</span>
    </grid-item>
  </grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Swipe, SwipeItem, Grid, GridItem, Image, Icon } from 'vant';

export default defineComponent({
  components: {
    Swipe,
    SwipeItem,
    Grid,
    GridItem,
    VanImage: Image,
    Icon,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
</style>

