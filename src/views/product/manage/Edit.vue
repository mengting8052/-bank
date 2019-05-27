<template>
  <div style="padding: 10px;">
    <Tabs :value="tab_value" style="min-height: 500px" :animated="false" @on-click="(name) => (tab_value = name)">
      <TabPane :label="$t('product.tabs.basic')" name="basic">
        <basic @next="basic_next" @confirm="confirm" ref="product-basic" :init-basic="initBasic"></basic>
      </TabPane>
      <TabPane :label="$t('product.tabs.sku')" name="sku">
        <sku @pre="sku_pre" @next="sku_next" @confirm="confirm" :btn-loading="btnLoading" ref="product-sku"></sku>
      </TabPane>
      <TabPane :label="$t('product.tabs.detail')" name="detail">
        <detail ref="product-detail" @confirm="confirm" :btn-loading="btnLoading" @pre="detail_pre" :init-detail="initDetail"></detail>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Basic from "./components/edit/Basic";
import Detail from "./components/edit/Detail";
import Sku from "./components/edit/Sku";
import SkuRendered from "./components/edit/SkuRendered";
import { get as fetchProduct, gvtGet as fetchGvtProduct, addOrUpdate, leadIn } from "../../../api/product";
import { debounce } from "../../../utils/helper.js"

export default {
  name: "product-manage-edit",

  components: { Basic, Detail, Sku, SkuRendered },

  data() {
    return {
      tab_value: "basic",
      initBasic: {},
      initDetail: "",
      btnLoading:  false
    };
  },

  created() {
    const id = this.$route.query.id;
    const gvt = this.$route.query.gvt;
    var getMethod;
    if(gvt) {
      getMethod = fetchGvtProduct(id);
    } else {
      getMethod = fetchProduct(id);
    }
    getMethod.then(response => {
      this.initBasic = response.data;
      this.initDetail = response.data.remark;
    })
    .catch();
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

      const params = Object.assign({}, product, {
        id: this.$route.query.id,
        skuList,
        remark
      });

      var postMethod;
      if(this.$route.query.gvt) {
        params.brandId = params.brandId === "none" ? null : params.brandId;
        params.classId = params.classId === "none" ? null : params.classId;
        postMethod = leadIn(params);
      } else {
        postMethod = addOrUpdate(params);
      }
      postMethod.then(response => {
        this.$Message.success(this.$t("common.success"));
        this.$router.go(-1);
      })
      .catch(error => {
        this.btnLoading = false
        this.$Message.error(error.message);
      });
    },

    basic_next(name) {
      this.tab_value = name;
    },

    sku_pre(name) {
      this.tab_value = name;
    },

    sku_next(name) {
      this.tab_value = name;
    },

    detail_pre(name) {
      this.tab_value = name;
    }
  }
};
</script>
