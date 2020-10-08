<template>
  <div>
    <div class="loader loader-border" :class="{ 'is-active': isLoading }"></div>
    <template v-if="isLoggedIn">
      <input class="w-full rounded text-xl p-2 text-black" type="text" v-model="url" placeholder="請輸入網址" />
      <button
        class="w-full text-center block border border-white rounded py-3 px-4 my-4"
        :disabled="isLoading"
        @click="shareTargetPickerWithFetch"
      >
        分享
      </button>

      <textarea class="w-full resize-y border rounded p-2 text-black mt-4" v-model="flexMsg" rows="10"></textarea>
      <button
        class="w-full text-center block border border-white rounded py-3 px-4 my-4"
        :disabled="isLoading"
        @click="shareTargetPicker"
      >
        分享
      </button>
    </template>

    <button v-else class="w-full text-center block border border-white rounded py-3 px-4 my-4" @click="login">
      登入
    </button>
  </div>
</template>

<script>
import liff from '@line/liff';
import { ref } from 'vue';

import { axiosInstace } from '@/services/base.svc';
import { loadFile } from '@/utils/image.util';

export default {
  setup() {
    const isLoggedIn = liff.isLoggedIn();
    const url = ref('');
    const isLoading = ref(false);
    const flexMsg = ref('');

    function login() {
      liff.login({
        redirectUri: window.location.href,
      });
    }

    async function shareTargetPickerWithFetch() {
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

        const image = opengraph['og:image'];
        let hero = null;
        if (image) {
          const $img = await loadFile.toImgEl(image);
          hero = {
            type: 'image',
            url: image,
            size: 'full',
            aspectRatio: `${$img.width}:${$img.height}`,
            aspectMode: 'cover',
          };
        }

        const flexMessage = {
          type: 'flex',
          altText: title,
          contents: {
            type: 'bubble',
            hero,
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
                  text: description ? (description.length > 100 ? `${description.slice(0, 100)}...` : description) : '',
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
        };

        flexMsg.value = JSON.stringify(flexMessage, null, 2);

        await liff.shareTargetPicker([flexMessage]);
      } catch (err) {
        alert(err);
      } finally {
        isLoading.value = false;
      }
    }

    async function shareTargetPicker() {
      try {
        if (!flexMsg.value) {
          return;
        }

        isLoading.value = true;

        await liff.shareTargetPicker([JSON.parse(flexMsg.value)]);
      } catch (err) {
        alert(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      url,
      isLoggedIn,
      isLoading,
      flexMsg,

      login,
      shareTargetPickerWithFetch,
      shareTargetPicker,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>