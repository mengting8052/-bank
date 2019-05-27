<template>
  <div style="padding: 10px;">
    <div style="color:#333; font-size:18px; padding:10px 0;">{{ title }}</div>

    <basic ref="basic" :basic="basic"></basic>

    <property ref="property"></property>
    <br>

    <tax ref="tax" :tax="tax"></tax>
    <br>

    <rate ref="rate"></rate>
    <br>

    <Button type="ghost" @click="$router.push({name: 'product-category-list'})">{{$t("common.cancel")}}</Button>
    <Button type="primary" @click="createOrUpdate" :loading="btnLoading">{{$t("common.confirm")}}</Button>
  </div>
</template>

<script>
import Basic from "./components/Basic";
import Property from "./components/Property";
import Tax from "./components/Tax";
import Rate from "./components/Rate";
import { addSecond, updateSecond, getSecond } from "../../../api/category";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  components: { Basic, Property, Tax, Rate },

  data() {
    return {
      btnLoading: false,

      basic: {
        id: this.$route.query.id || "",
        name: "",
        parentId: this.$route.query.parentId || "",
        imageUrl: "",
        sort: 0
      },

      tax: []
    };
  },

  computed: {
    title() {
      return this.basic.id ? i18n.t("product.category.editSencondCategory") : i18n.t("product.category.createSecondCategory");
    }
  },

  created() {
    this.basic.id && this.initCategory()
  },

  methods: {
    initCategory() {
      getSecond(this.basic.id).then(response => {
        this.tax = response.data.listTax
        delete response.data.listTax
        this.basic = Object.assign({}, this.basic, response.data)
      }).catch(error => {
        this.$Message.error(error.message)
      })
    },

    createOrUpdate() {
      this.btnLoading = true;

      let basic = this.$refs["basic"].getRequestData();
      let property = this.$refs["property"].getRequestData();
      let tax = this.$refs["tax"].getRequestData();
      let rate = this.$refs["rate"].getRequestData();

      const params = { id: this.basic.id, ...basic, ...property, ...tax, ...rate };

      const requestMethod = this.basic.id ? updateSecond : addSecond;

      requestMethod(params)
        .then(response => {
          this.$Message.success(i18n.t("common.success"));
          this.$router.push({name: "product-category-list"})
          this.btnLoading = false;
        })
        .catch(error => {
          this.$Message.error(error.message);
          this.btnLoading = false;
        });
    }
  }
};
</script>