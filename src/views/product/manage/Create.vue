<template>
  <div style="padding: 10px;">
    <Tabs :value="tab_value" style="min-height: 500px" :animated="false" @on-click="(name) => (tab_value = name)">
      <TabPane :label="$t('product.tabs.basic')" name="basic">
        <basic @next="tabSkip('sku')" ref="product-basic" :init-basic="initBasic"></basic>
      </TabPane>
      <TabPane :label="$t('product.tabs.sku')" name="sku">
        <sku @pre="tabSkip('basic')" @next="tabSkip('detail')" @confirm="confirm" :btn-loading="btnLoading" ref="product-sku" :init-sku="initSku"></sku>
      </TabPane>
      <TabPane :label="$t('product.tabs.detail')" name="detail">
        <detail ref="product-detail" @confirm="confirm" :btn-loading="btnLoading" @pre="tabSkip('sku')"></detail>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Basic from "./components/create/Basic";
import Detail from "./components/create/Detail";
import Sku from "./components/create/Sku";
import { addOrUpdate } from "../../../api/product";
import { debounce } from "../../../utils/helper";
import qs from "qs";

export default {
  name: "product-manage-create",

  components: { Basic, Detail, Sku },

  data() {
    return {
      btnLoading: false,
      tab_value: "basic",
      initBasic: { info: {}, unit: {}, tax: [] },
      initSku: {}
    };
  },

  created() {
    if (this.$route.query.params) {
      const params = qs.parse(this.$route.query.params);
      this.initBasic = Object.assign({}, this.initBasic, params.basic);
      this.initSku = Object.assign({}, this.initSku, params.sku);
    }
  },

  methods: {
    confirm: debounce(function() {
      this.btnLoading = true
      this.sendRequest()
    }, 500),

    sendRequest() {
      let product = this.$refs["product-basic"].getData();
      let skuList = this.$refs["product-sku"].getData();
      let remark = this.$refs["product-detail"].getData();

      const params = Object.assign({}, product, { skuList, remark });
      
      addOrUpdate(params)
        .then(response => {
          this.$Message.success(this.$t("common.success"));
          // 若为来自快速新增的跳转, 商品新增成功后则跳转至商户的商品列表
          // 其他情况均 go(-1)
          if (
            this.$route.query.from &&
            this.$route.query.from === "fast-create"
          ) {
            this.$router.push({ name: "product-tenant-list" });
          } else {
            this.$router.go(-1);
          }
        })
        .catch(error => {
          this.btnLoading = false
          this.$Message.error(error.message);
        });
    },

    tabSkip(name) {
      this.tab_value = name;
    }
  }
};
</script>
