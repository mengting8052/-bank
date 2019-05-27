<template>
  <gvt-layout>

    <template slot="title">{{$t("product.negative.title.negative")}}</template>

    <template slot="search">
      <Form ref="searchForm" inline :model="form">
        <FormItem prop="keyWord">
          <Input type="text" style="width: 200px;" v-model="form.keyWord" :placeholder="$t('product.negative.placeholder')"></Input>
        </FormItem>
        <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
        <Button type="ghost" @click="reset()">{{$t("common.reset")}}</Button>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="visible = !visible">{{$t("common.create")}}</Button>
    </template>

    <template slot="data-table">
      <Table :loading="table.loading" :data="table.data" :columns="table.columns" :height="$layout.tableHeight"></Table>
    </template>

    <template slot="data-page">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData()"
      ></gvt-page>
    </template>

    <product-modal :visible.sync="visible" @on-success="success"></product-modal>
  </gvt-layout>
</template>

<script>
import { layout_break } from "../../../mixins/layout";
import { PAGE_PARAMS } from "../../../constants";
import { getPageProductNegativeList, deleteById } from "../../../api/productNegative.js"
import ProductModal from "./components/ProductModal"
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_break],

  components: { ProductModal },

  data() {
    return {
      form: {
        keyWord: ""
      },

      visible: false,

      pagination: Object.assign({}, PAGE_PARAMS),

      table: {
        loading: false,
        data: [],
        columns: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("product.negative.productName"),
            key: "productName"
          },
          {
            title: i18n.t("product.negative.gvtBarCode"),
            key: "gvtBarCode"
          },
          {
            title: i18n.t("product.negative.barCode"),
            key: "barCode"
          },
          {
            title: i18n.t("product.negative.className"),
            key: "className"
          },
          {
            title: i18n.t("common.operate"),
            key: "CURD",
            align: "center",
            render: (h, params) => {
              return h("Button", {
                props: {
                  type: "text"
                },
                class: ["remove-btn"],
                on: {
                  click: () => {
                    this.remove(params.row.id);
                  }
                }
              }, i18n.t("common.remove"))
            }
          },
        ]
      }
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      getPageProductNegativeList(params)
        .then(response => {
          this.table.loading = false;
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
        }).catch(error => {
          this.table.loading = false;
        })
    },

    success() {
      this.loadData(true);
    },

    remove(id) {
      this.$Modal.confirm({
        title: i18n.t("common.notify"),
        content: i18n.t("common.removeNotice"),
        loading: true,
        onOk: () => {
          deleteById(id).then(response => {
            this.$Modal.remove()
            this.$Message.success(i18n.t("common.success"))
            this.loadData()
          }).catch(error => {
            this.$Modal.remove()
            this.$Message.error(error.message)
          })
        }
      })
    },

    reset() {
      this.$refs["searchForm"].resetFields()
    }
  }
}
</script>