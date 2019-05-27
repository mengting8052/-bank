<template>
  <div>
    <product-editor :value="remark" ref="product-editor"></product-editor>
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
  components: {
    productEditor
  },

  props: {
    initDetail: [String],
    btnLoading: Boolean
  },

  data() {
    return {
      remark: ""
    };
  },

  watch: {
    initDetail(val) {
      this.remark = val;
    }
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
