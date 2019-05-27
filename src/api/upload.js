import ajax from "../utils/ajax";

export function uploadBase64(data={}) {
  return ajax({
    method: "post",
    url: "/file/uploadBase64",
    data
  })
}
