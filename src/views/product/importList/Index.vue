<template>
  <gvt-layout>
    <template slot="title">{{$t("product.importList.title")}}</template>
    <template slot="search">
      <Form ref="searchForm" :model="form" inline>
        <FormItem prop="name">
          <Input v-model="form.keyWord" :placeholder="$t('product.importList.placeholder')"></Input>
        </FormItem>
        <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
        <Button type="ghost" @click="reset()">{{$t("common.reset")}}</Button>
      </Form>
    </template>
    <template slot="btn-groups">
      <upload-file></upload-file>
    </template>
    <template slot="data-table">
      <Table
        :loading="table.loading"
        :columns="table.columns"
        :data="table.data"
        :height="$layout.tableHeight"
      ></Table>
    </template>
    <template slot="data-page">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData()"
      ></gvt-page>
    </template>
  </gvt-layout>
</template>
<script>
import { i18n } from "../../../setup/i18n-setup";

import { layout_break } from "../../../mixins/layout.js";

import {
  featchProductWhiteList,
  importProductWhiteList
} from "../../../api/importList.js";
import { PAGE_PARAMS } from "../../../constants";
import uploadFile from "../../../components/common/uploadFile";
export default {
  mixins: [layout_break],

  components: { uploadFile },

  data() {
    return {
      form: {
        keyWord: ""
      },
      table: {
        loading: false,
        columns: [
          {
            type: "index",
            width: 60
          },
          {
            title: i18n.t("product.importList.table.taxNumber"),
            key: "taxNumber"
          },
          {
            title: i18n.t("product.importList.table.description"),
            key: "description"
          },
          {
            title: i18n.t("product.importList.table.underBond"),
            key: "underBond",
            render: (h, params) => {
              let text = params.row.underBond == true ? i18n.t("product.importList.enable") : i18n.t("product.importList.disable");
              return h("span", text);
            }
          }
        ],
        data: []
      },

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true;
      reload = true && (this.pagination.current = 1);

      let params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      featchProductWhiteList(params)
        .then(response => {
          if (response.data.list.length > 0) {
            this.table.data = response.data.list;
            this.pagination.total = response.data.total;
          } else {
            this.table.data = [];
          }
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    reset() {
      this.form.keyWord = "";
    }
  }
};
</script>
