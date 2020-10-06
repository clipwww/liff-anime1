<template>
  <div>
    <div class="loader loader-border" :class="{ 'is-active': isLoading }"></div>
    <input
      v-if="isLoggedIn"
      class="w-full rounded text-xl p-2 text-black"
      type="text"
      v-model="url"
      placeholder="請輸入網址"
    />
    <button
      v-if="!isLoggedIn"
      class="w-full text-center block border border-white rounded py-3 px-4 my-4"
      @click="login"
    >
      登入
    </button>
    <button
      v-else
      class="w-full text-center block border border-white rounded py-3 px-4 my-4"
      :disabled="isLoading"
      @click="shareTargetPicker"
    >
      分享
    </button>
  </div>
</template>

<script>
import liff from '@line/liff';
import { ref } from 'vue';

import { axiosInstace } from '@/services/base.svc';

export default {
  setup() {
    const isLoggedIn = liff.isLoggedIn();
    const url = ref('');
    const isLoading = ref(false);

    function login() {
      liff.login({
        redirectUri: window.location.href,
      });
    }

    async function shareTargetPicker() {
      try {
        if (!url.value) {
          return;
        }

        isLoading.value = true;
        const ret = await axiosInstace.get(`https://mechakucha-api.herokuapp.com/meta-fetcher`, {
          params: {
            url: url.value,
          },
        });
        if (!ret.success) {
          return;
        }

        const { url: uri, title, description, opengraph } = ret.item;

        await liff.shareTargetPicker([
          {
            type: 'flex',
            altText: title,
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: opengraph['og:image'],
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover',
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: title,
                    weight: 'bold',
                    size: 'md',
                    wrap: true,
                    margin: 'none',
                  },
                  {
                    type: 'text',
                    text: description,
                    wrap: true,
                    size: 'xs',
                    margin: 'md',
                  },
                ],
              },
              action: {
                type: 'uri',
                label: 'action',
                uri,
              },
            },
          },
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      url,
      isLoggedIn,
      isLoading,

      login,
      shareTargetPicker,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>