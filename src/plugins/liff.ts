import { Notification, Message } from 'element-ui';

import { LiffError } from '@/view-models/liff.vm';

const liff = window.liff;
export const installLIFF = async () => {
  const liffId = process.env.VUE_APP_LIFF_ID as string;
  console.log(liff, liffId);

  if (!liffId) {
    Notification({
      title: 'Oops',
      message: '缺少Liff Id，請檢查.env',
    })
    return;
  }

  try {
    await liff.init({
      liffId,
    })
  } catch (err) {
    Notification({
      title: 'Oops',
      message: (err as LiffError).message
    })
  }

  console.log(liff.getVersion())
}

export const sendAlertIfNotInClient = () => {
  Notification({
    type: 'error',
    title: '這個功能只能在Line裡面使用！',
    message: ''
  });
}

export const scanCode = async () => {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
    return;
  }

  if (!liff.scanCode) {
    Notification({
      type: 'error',
      title: '您的裝置不支援LIFF掃描功能！',
      message: ''
    });
    return;
  }


  try {
    const ret = await liff.scanCode();
    return ret;
  } catch (err) {
    Message.error(err.message);
    return;
  }
}