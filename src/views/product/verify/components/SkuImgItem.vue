<template>
  <div class="sku-image-item">
    <div class="image-wrapper" @click="imgClick">
      <Icon v-if="src == ''" type="plus-round" class="plus-btn" size="50" color="#f0f2f5"></Icon>
      <img v-else class="img" :src="src" />
      <input ref="upload" type="file" style="display:none;" @change="fileChange" accept="image/jpg, image/jpeg, image/png" />
    </div>
    <div class="btn-wrapper">
      <Row>
        <Col span="12">
          <Button type="ghost" size="small" @click="remove" :disabled="disEdit">{{$t('common.remove')}}</Button>
        </Col>
        <Col span="12" v-show="firstImg">
          <div style="color:#fc504d;line-height:24px;text-align:right;">{{$t('product.skuImgItem.notice')}}</div> 
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { uploadBase64 as UploadImg } from "../../../../api/upload";
import html5ImgCompress from "html5-image-compress";

export default {
  name: "sku-img-item",

  props: {
    // 图片地址
    imgSrc: [String],
    // 商品头图标识
    firstImg: [Boolean],
    disEdit: [Boolean]
  },

  data() {
    return {
      src: this.imgSrc
    };
  },

  watch: {
    imgSrc(val) {
      this.src = val;
    },
  },

  methods: {
    imgClick() {
      if(this.disEdit) return;
      this.$refs["upload"].click();
    },

    fileChange() {
      let vm = this;
      let files = vm.$refs["upload"]["files"];
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
    },

    remove() {
      this.src = "";
    }
  }
};
</script>


