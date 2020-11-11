import dayjs from 'dayjs';
import zhTW from 'dayjs/locale/zh-tw'
import isLeapYear from 'dayjs/plugin/isLeapYear';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.locale(zhTW);
dayjs.extend(isLeapYear);
dayjs.extend(weekday);
dayjs.extend(isoWeek);