import Vue, { VueConstructor } from 'vue';
import moment from 'moment';
import _get from 'lodash/get';

const MyVueFilter = function (Vue: VueConstructor, options: any) {
  Vue.filter('formatDate', (str: string, hasTime: boolean = true) => {
    if (!str) {
      return '';
    }
    return moment(str).format(hasTime ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD');
  })

  Vue.filter('commafy', (num: string | number, maximumFractionDigits: number = 4) => {
    try {
      return (+num).toLocaleString(undefined, { maximumFractionDigits });
    } catch (err) {
      return num;
    }
  })


  Vue.filter('_get', (object: any, path: string, defaultValue: any = null) => {
    return _get(object, path, defaultValue)
  })
}

Vue.use(MyVueFilter);
