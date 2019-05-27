import numeral from "numeral"
import moment from "moment"

export function numberFormat(number) {
  return numeral(number).format("00.00");
}

export function timeFormat(unixTime = "", full = true) {
  if (unixTime) {
    if (full) {
      return moment(unixTime).format('YYYY-MM-DD HH:mm:ss')
    } else {
      return moment(unixTime).format('YYYY-MM-DD')
    }
  } else {
    return "";
  }

}
