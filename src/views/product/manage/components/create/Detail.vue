<template>
  <div>
    <product-editor ref="product-editor"></product-editor>
    <br>
    <div>
      <Button type="primary" @click="pre">{{$t('product.tabs.pre')}}</Button>
      <Button type="primary" @click="confirm" :loading="btnLoading">{{$t('common.confirm')}}</Button>
      <Button type="ghost" @click="$router.go(-1)">{{$t('common.cancel')}}</Button>
    </div>
  </div>
</template>

<script>
import productEditor from "../../../../../components/common/editor";
export default {
  components: { productEditor },

  props: {
    btnLoading: Boolean,
  },

  methods: {
    getData() {
      return this.$refs["product-editor"].getHtml();
    },

    confirm() {
      this.$emit("confirm");
    },

    pre() {
      this.$emit("pre", "sku");
    }
  }
};
</script>

