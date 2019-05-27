<template>
  <div>
    <input ref="upload" type="file" style="display:none;" @change="fileChange" accept="image/jpg, image/jpeg, image/png" />
    <img 
      v-if="src" 
      :src="src" 
      @click="click" 
      :title="$t('product.productImage.title')"
      style="display:block;width:100px;height:auto;cursor:pointer;"/>
    <Button v-else type="ghost" icon="android-upload" @click="click"></Button>
  </div>
</template>

<script>
import html5ImgCompress from "html5-image-compress";
import { uploadBase64 as UploadImg } from "../../../../api/upload";
export default {
  props: {
    value: [String]
  },

  watch: {
    value(val) {
      this.src = val;
    },
    src(val) {
      this.$emit("input", val);
    }
  },

  data() {
    return {
      src: ""
    };
  },

  methods: {
    click() {
      this.$refs["upload"].click();
    },

    fileChange() {
      let vm = this;
      let files = vm.$refs["upload"]["files"];
      if (files.length) {
        new html5ImgCompress(files[0], {
          done: function(file, fileBase64) {
            UploadImg({ fileBase64 })
              .then(response => {
                vm.src = response.data;
              })
              .catch(error => {
                vm.$Message.error(error.message);
              });
          }
        });
      }
    }
  }
};
</script>

