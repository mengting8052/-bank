
<template>
    <div>
     <input ref='upload' type='file' style='display:none' @change='fileChange' accept="image/jpg, image/jpeg, image/png"/>
      <img v-if='imageUrl' 
      :src='imageUrl'
      style='display:block;width:60px;height:auto;cursor:pointer'
       @click='flieClick'/>
    <Button v-else type='ghost' icon='android-upload' @click='flieClick'></Button>
    </div> 
</template>
<script>
import Html5ImgCompress from "html5-image-compress";
import { uploadBase64 } from "../../api/upload";
export default {
  props: {
    value: [String]
  },
  data() {
    return {
      imageUrl: ""
    };
  },
  watch: {
    value(val) {
      this.imageUrl = val;
    },
    imageUrl(val) {
      this.$emit("input", val);
    }
  },

  methods: {
    flieClick() {
      this.$refs["upload"].click();
    },
    fileChange() {
      var _this = this;
      let files = _this.$refs["upload"].files;
      new html5ImgCompress(files[0], {
        done: function(file, base64) {
          uploadBase64({ fileBase64: base64 })
            .then(response => {
              _this.imageUrl = response.data;
              _this.$emit("onSuccessImg", _this.imageUrl);
            })
            .catch(error => {
              _this.$Message.error(error.message);
            });
        }
      });
    }
  }
};
</script>

