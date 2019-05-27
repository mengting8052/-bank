<template>
  <div>
    <input ref='upload' type='file' style='display:none' @change="fileChange"/>
     <Button type="primary" @click='flieClick'>{{$t('product.importList.import')}}</Button>
    <Button type="primary" @click="downModel">{{$t('product.importList.download')}}</Button>
  </div>
</template>
<script>
import {importProductWhiteList,downModel} from "../../api/importList.js"
import {BACKEND_DOMAIN} from "../../utils/env.js"
import { i18n } from "../../setup/i18n-setup.js"
export default {
  data(){
    return{}
  },
  methods:{
    fileChange(){
       var fd = new FormData();
        let files = this.$refs["upload"].files;
        fd.append('file', files[0])
        this.$nextTick(()=>{
          importProductWhiteList(fd).then(response=>{
            if(response.code=="200"){
                this.$Message.success(this.$t("common.success"))
            }
           document.getElementById("uploadFile").value="";
          }).catch(error=>{
              this.$Message.error(error.message)
          })
        })
    },
    flieClick(){
      this.$refs["upload"].click();
    },
    downModel(){
      const url=`${BACKEND_DOMAIN}/productWhiteList/downModel`
      window.open(url)
    }
  }
}
</script>

