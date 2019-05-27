<template>
  <Modal v-model="show" :title="title" :width="600" :model="form.data" :loading="loading" @on-ok="createOrUpdate" @on-visible-change="visibleChange">
    <Form inline :label-width="80">
      <FormItem :label="$t('product.tax.area')">
        <Cascader :data="nations" v-model="area" change-on-select @on-change="cascaderChange"></Cascader>
      </FormItem>
      <FormItem :label="$t('product.tax.shortName')">
        <Input type="text" v-model="form.data.shortName"></Input>
      </FormItem>
      <FormItem :label="$t('product.tax.name')">
        <Input type="text" v-model="form.data.name"></Input>
      </FormItem>
      <FormItem :label="$t('product.tax.remark')">
        <Input type="text" v-model="form.data.remark"></Input>
      </FormItem>
      <FormItem>
        <Checkbox v-model="form.data.status">{{$t("product.tax.status")}}</Checkbox>
        <Checkbox v-model="form.data.local">{{$t("product.tax.local")}}</Checkbox>
        <Checkbox v-model="form.data.importing">{{$t("product.tax.importing")}}</Checkbox>
        <Checkbox v-model="form.data.exporting">{{$t("product.tax.exporting")}}</Checkbox>
      </FormItem>
      <FormItem :label="$t('product.tax.rate')">
        <Input type="textarea" v-model="form.data.rate" :autosize="{maxRows: 6}"></Input>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="ghost" @click="show = false">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="createOrUpdate" :loading="loading">{{$t("common.confirm")}}</Button>
    </div>

  </Modal>
</template>

<script>
const TAX_OBJ = Object.freeze({
  id: "",
  // 国家
  nation: "",
  nationCode: "",
  // 省
  province: "",
  provinceCode: "",
  // 全称
  name: "",
  // 简称
  shorName: "",
  // 备注
  remark: "",
  // 是否启用
  status: true,
  // 本地流通
  local: false,
  // 进口
  importing: false,
  // 出口
  exporting: false,
  // 税率
  rate: ""
});

import { get, add, update } from "../../../../api/tax"
import { i18n } from "../../../../setup/i18n-setup.js"

export default {

  props: {
    visible: Boolean,

    nations: {
      type: Array,
      default: () => []
    },

    taxId: {
      type: [String, Number],
      default: ""
    }
  },

  data() {
    return {
      show: this.visible,

      loading: false,

      area: [],

      form: {
        data: Object.assign({}, TAX_OBJ)
      }
    }
  },

  watch: {
    visible(val) {
      this.show = val
    },

    show(val) {
      this.$emit("update:visible", val)
    }
  },

  computed: {
    title() {
      return this.form.data.id ? i18n.t("product.tax.editTax") : i18n.t("product.tax.createTax")
    }
  },

  methods: {
    initTax() {
      get(this.form.data.id).then(response => {
        response.data.nationCode && this.area.push(response.data.nationCode)
        response.data.provinceCode && this.area.push(response.data.provinceCode)
        response.data.local = response.data.local ? response.data.local : false 
        response.data.importing = response.data.importing ? response.data.importing : false 
        response.data.exporting = response.data.exporting ? response.data.exporting : false 
        const rate = response.data.rate ? response.data.rate.split(",").join("\r\n") : ""
        
        const tax = Object.assign({}, response.data, {rate})
        this.form.data = Object.assign({}, this.form.data, tax)
      })
    },

    cascaderChange(value, selectedData) {
      if (selectedData.length) {
        if (selectedData.length === 1) {
          this.form.data.nation = selectedData[0]["label"];
          this.form.data.nationCode = selectedData[0]["value"];
          this.form.data.province = "";
          this.form.data.provinceCode = "";
        } else {
          this.form.data.nation = selectedData[0]["label"];
          this.form.data.nationCode = selectedData[0]["value"];
          this.form.data.province = selectedData[1]["label"];
          this.form.data.provinceCode = selectedData[1]["value"];
        }
      } else {
        this.form.data.nation = "";
        this.form.data.nationCode = "";
        this.form.data.province = "";
        this.form.data.provinceCode = "";
      }
    },

    visibleChange(visible) {
      if(visible) {
        this.area = []
        this.form.data = Object.assign({}, TAX_OBJ, { id: this.taxId })
        this.taxId && this.initTax()
      }
    },

    createOrUpdate() {
      const requestMethod = this.form.data.id ? update : add
      const params = Object.assign({}, this.form.data, {rate: this.form.data.rate.replace(/\r\n|\r|\n/g,",")})
      requestMethod(params).then(response => {
        this.loading = false
        this.$Message.success(i18n.t("common.success"))
        this.show = false
        this.$emit("on-success")
      }).catch(error => {
        this.loading = false
        this.$Message.error(error.message)
      })
    }
  }

}
</script>
