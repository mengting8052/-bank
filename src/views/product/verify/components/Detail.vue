<template>
  <div>
    <product-editor :value="remark" ref="product-editor"></product-editor>

    <br>
    <div>
      <Button type="primary" @click="pre">{{$t("product.tabs.pre")}}</Button>
      <Button type="primary" @click="confirm" :disabled="disabled">{{$t("product.tabs.pass")}}</Button>
      <Button type="primary" @click="refuse" :disabled="disabled">{{$t("product.tabs.refuse")}}</Button>
      <Button type="ghost" @click="$router.go(-1)">{{$t("common.cancel")}}</Button>
    </div>

  </div>
</template>

<script>
import productEditor from "../../../../components/common/editor";
export default {
  components: { productEditor },

  props: {
    initDetail: [String]
  },

  data() {
    return {
      remark: "",
      disabled: false
    };
  },

  watch: {
    initDetail(val) {
      this.remark = val;
    }
  },

  created() {
    this.$bus.on("sended-request", this.unlockBtns);
  },

  beforeDestroy() {
    this.$bus.off("sended-request", this.unlockBtns);
  },

  methods: {
    getData() {
      return this.$refs["product-editor"].getHtml();
    },

    lockBtns() {
      this.disabled = true;
    },

    unlockBtns() {
      setTimeout(() => {
        this.disabled = false;
      }, 1500);
    },

    pre() {
      this.$emit("pre", "sku");
    },

    confirm() {
      this.lockBtns();
      this.$emit("confirm", 1);
    },

    refuse() {
      this.lockBtns();
      this.$emit("confirm", 2);
    }
  }
};
</script>

