import ajax from "../utils/ajax"

export function listDictionaryByCode(code) {
  return ajax({
    method: "post",
    url: `/dictionary/listDictionaryByCode?code=${code}`
  })
}