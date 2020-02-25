import introJS from 'intro.js';
import 'intro.js/introjs.css';

export function createIntro() {
  const intro = introJS();

  intro.setOptions({
    nextLabel: '下一個',
    prevLabel: '上一個',
    skipLabel: '略過',
    doneLabel: '我知道了！',
    exitOnOverlayClick: false,
    showBullets: true,
    hidePrev: true,
    hideNext: true,
  })

  return intro;
}