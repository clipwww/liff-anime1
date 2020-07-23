<template>
  <div id="app">
    <div class="container mx-auto">
      <div class="p-2">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :max="5" :include="'AgefansList'">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  components: {},
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
</style>
