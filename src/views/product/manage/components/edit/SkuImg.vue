<style lang="less">
.sku-image-wrapper {
  width: 100%;
  .sku-image-item {
    width: 156px;
    margin-bottom: 10px;
    display: inline-block;
    &:nth-child(2),
    &:nth-child(5) {
      margin-left: 10px;
      margin-right: 10px;
    }
    .image-wrapper {
      width: 100%;
      height: 156px;
      position: relative;
      margin-bottom: 5px;
      border: 1px solid rgba(223, 223, 223, 1);
      cursor: pointer;
      .img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .plus-btn {
        position: absolute;
        display: block;
        width: 50px;
        height: 50px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>

<template>
  <Modal v-model="show" :title="$t('product.skuImg.image')" :closable="false">
    <div class="sku-image-wrapper" v-if="show">
      <sku-img-item 
        v-for="(item, index) in imgList" 
        :key="index + 1" 
        :img-src="item"
        :first-img="index === 0 ? true : false"
        :read-only="readOnly">
      </sku-img-item>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t('common.cancel')}}</Button>
      <Button type="primary" @click="confirm" :disabled="readOnly">{{$t('common.confirm')}}</Button>
    </div>
  </Modal>
</template>

<script>
import SkuImgItem from "./SkuImgItem";
import { findComponentsDownward } from "../../../../../utils/helper";
export default {
  name: "sku-img",

  components: { SkuImgItem },

  props: {
    readOnly: Boolean,
    visible: [Boolean],
    skuImage: [String]
  },

  data() {
    return {
      show: this.visible,
      // 控制图片最大张数, 万一以后改成6,7,8 张呢?
      // 若其发生变化, 你可能需要 hack .sku-image-item 的样式
      max: 5,
      imgs: this.skuImage,
    };
  },

  watch: {
    visible(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:visible", val);
    },
    skuImage(val) {
      this.imgs = val;
    },
  },

  computed: {
    imgList() {
      // 商品图片集合
      let list = this.imgs.split(",");
      // 商品图片集合长度
      const length = list.length;
      // 与最大图片数相比
      const diff = this.max - length;
      // 若不够, 则像集合中添加空字符串补位
      // 保持集合长度与图片最大张数相同
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          list.push("");
        }
      }
      return list;
    }
  },


  methods: {
    confirm() {
      const items = findComponentsDownward(this, "sku-img-item");
      const arr = items.map(item => item.src);
      this.imgs = arr.join(",");
      this.$emit("add-sku-image", this.imgs);
      this.show = !this.show;
    }
  }
};
</script>

