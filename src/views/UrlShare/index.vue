<template>
  <div>
    <template v-if="isLoggedIn">
      <Field v-model="url" label="網址" label-width="50px" placeholder="請輸入網址" />

      <div class="p-2">
        <Button type="primary" :disabled="isLoading" block @click="shareTargetPickerWithFetch">分享</Button>
      </div>

      <Divider />

      <Field type="textarea" v-model="flexMsg" rows="10" />
      <div class="p-2">
        <Button type="primary" :disabled="isLoading" block @click="shareTargetPicker">分享</Button>
      </div>
    </template>

    <div v-else class="p-2">
      <Button type="success" class="my-4" block @click="login">登入</Button>
    </div>
  </div>
</template>

<script>
import liff from '@line/liff';
import { defineComponent, ref, watch } from 'vue';
import { Button, Field, Divider, Toast } from 'vant';

import { axiosInstace, baseURL } from '@/services/base.svc';
import { loadFile } from '@/utils/image.util';
import router from '@/router';

export default defineComponent({
  components: {
    Button,
    Field,
    Divider,
  },
  setup() {
    const isLoggedIn = liff.isLoggedIn();
    const url = ref(router.currentRoute.value.query.url || '');
    const isLoading = ref(false);
    const flexMsg = ref('');

    watch(isLoading, (bool) => {
      if (bool) {
        Toast.loading({
          message: '抓取資料中...',
          duration: 0,
        });
      } else {
        Toast.clear();
      }
    });

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

        const ret = await axiosInstace.get(`${baseURL}/meta-fetcher`, {
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
});
</script>

<style lang="scss" scoped>
</style>
