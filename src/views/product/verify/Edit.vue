<template>
  <div style="padding: 10px;">
    <Tabs :value="tab_value" style="min-height: 500px" :animated="false" @on-click="(name) => (tab_value = name)">
      <TabPane :label="$t('product.tabs.basic')" name="basic">
        <basic @next="tabSkip('sku')" ref="product-basic" :init-basic="initBasic"></basic>
      </TabPane>
      <TabPane :label="$t('product.tabs.sku')" name="sku">
        <sku @pre="tabSkip('basic')" @next="tabSkip('detail')" ref="product-sku" @generate_sku="generateSku = true"></sku>
      </TabPane>
      <TabPane :label="$t('product.tabs.detail')" name="detail">
        <detail ref="product-detail" @pre="tabSkip('sku')" @confirm="confirm" :init-detail="initDetail"></detail>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Basic from "./components/Basic";
import Detail from "./components/Detail";
import Sku from "./components/Sku";
import {
  productAuditDetailInfo,
  productAuditSkuInfo,
  productAudit,
  productAuditReject
} from "../../../api/productAudit";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  name: "product-verify-edit",

  components: { Basic, Detail, Sku },

  data() {
    return {
      tab_value: "basic",
      initBasic: {},
      initDetail: "",
      generateSku: false,
    };
  },

  created() {
    const id = this.$route.query.id;
    let vm = this;
    productAuditDetailInfo({ id }).then(response => {
      vm.initBasic = response.data;
      vm.initDetail = response.data.remark || "";
    });
  },

  methods: {
    confirm(status = 1) {
      if (status == 2) {
        productAuditReject(this.$route.query.id)
          .then(response => {
            this.$Message.success(i18n.t("product.verify.verifyFinished"));
            this.$router.push({ name: "product-verify-list" });
          })
          .catch(error => {
            this.$bus.emit("sended-request");
            this.$Message.error(error.message);
          });
        return;
      }
      let product = this.$refs["product-basic"].getData();

      if (product.brandId === "none") {
        this.$Message.error(i18n.t("product.verify.brandError"));
        this.$bus.emit("sended-request");
        return;
      }

      if (product.classId === "none") {
        this.$Message.error(i18n.t("product.verify.classIdError"));
        this.$bus.emit("sended-request");
        return;
      }

      if (!this.generateSku) {
        this.$Message.error(i18n.t("product.verify.skuError"));
        this.$bus.emit("sended-request");
        return;
      }

      let productSkuAuditDTOList = this.$refs["product-sku"].getData();
      let remark = this.$refs["product-detail"].getData();
      let id = this.$route.query.id;
      const params = Object.assign({}, product, {
        productSkuAuditDTOList,
        remark,
        id,
        status
      });

      productAudit(params)
        .then(response => {
          this.$Message.success(i18n.t("product.verify.verifySuccess"));
          this.$router.push({ name: "product-verify-list" });
        })
        .catch(error => {
          this.$bus.emit("sended-request");
          this.$Message.error(error.message);
        });
    },

    tabSkip(name) {
      this.tab_value = name;
    }
  }
};
</script>
