<template>
  <gvt-layout>

    <template slot="title">
      {{ $t("paymentTaxForm.title") }}
    </template>

    <template slot="search">
      <Form :model="form" inline @submit.native.prevent>
        <FormItem prop="key">
          <Input type="text" v-model="form.key" :placeholder="$t('paymentTaxForm.placeholder')" @on-enter="loadData(true)"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" :disabled="uploading" @click="loadData(true)">{{ $t("common.search") }}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="click" :loading="uploading">{{$t("paymentTaxForm.importBtn")}}</Button>
      <input ref="upload" type="file" style="display: none;" @change="fileChange" accept=".csv, .xlsx, .xls"/>
      <a class="ivu-btn ivu-btn-primary" href="/static/excel/Item Duty Price List Import Template.xlsx" target="_blank">
        <span>{{$t("paymentTaxForm.exportBtn")}}</span>
      </a>
    </template>

    <template slot="data-table">
      <Table :loading="table.loading || uploading" :data="table.data" :columns="table.cols"></Table>
    </template>

    <template slot="data-page">
      <gvt-page v-show="!uploading" :pagination="pagination" @on-page-size-change="loadData(true)" @on-page-change="loadData()"></gvt-page>
    </template>

  </gvt-layout>
</template>

<script>
import { PAGE_PARAMS } from "../../../constants"
import { listPage, importTaxRate } from "../../../api/taxRate"
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  data() {
    return {
      form: { key: "" },

      uploading: false,

      pagination: Object.assign({}, PAGE_PARAMS),

      table: {
        loading: false,
        data: [],
        cols: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("paymentTaxForm.taxNum"),
            key: "taxNum"
          },
          {
            title: i18n.t("paymentTaxForm.productName"),
            key: "productName"
          },
          {
            title: i18n.t("paymentTaxForm.unit"),
            key: "unit"
          },
          {
            title: i18n.t("paymentTaxForm.price"),
            key: "price"
          },
          {
            title: i18n.t("paymentTaxForm.rate"),
            key: "rate"
          }
        ]
      }
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true
      reload && (this.pagination.current = 1)
      const params = Object.assign({}, this.form, { pageSize: this.pagination.pageSize, pageNum: this.pagination.current })
      listPage(params).then(response => {
        this.table.data = response.data.list
        this.pagination.total = response.data.total
        this.$nextTick(() => {
          this.table.loading = false
        })
      }).catch(error => {
        this.table.loading = false
      })
    },

    click() {
      this.$refs["upload"].click()
    },

    fileChange() {
      this.uploading = true
      var data = new FormData();
      data.append("file", this.$refs["upload"]["files"][0])
      importTaxRate(data).then(response => {
        this.$refs["upload"].value = ""
        this.$Message.success(i18n.t("common.success"))
        this.loadData(true)
        this.uploading = false
      }).catch(error => {
        this.$refs["upload"].value = ""
        this.$Message.error(error.message)
        this.uploading = false
      })
    }
  }
};
</script>

