<template>
  <Modal v-model="show" :title="$t('product.category.choosePPGroup')" width="700">
    <Table :loading="table.loading" :columns="table.cols" :data="table.data" @on-selection-change="selectionChange"></Table>
    <br>
    <br>
    <div style="text-align: right">
      <gvt-page :pagination="pagination" @on-page-size-change="pageSizeChange" @on-page-change="pageChange"></gvt-page>
    </div>

    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirmAndClose(false)">{{$t("common.choose")}}</Button>
      <Button type="primary" @click="confirmAndClose(true)">{{$t("common.confirmAndChoose")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { listPageSelected } from "../../../../api/property";
import { PAGE_PARAMS } from "../../../../constants";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      show: this.visible,

      selection: [],

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
            type: "selection",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("product.category.code"),
            key: "code"
          },
          {
            title: i18n.t("product.category.name"),
            key: "name"
          }
        ]
      }
    };
  },

  watch: {
    visible(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {
    this.loadData();
  },

  methods: {

    loadData() {
      const params = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      };
      this.table.loading = true;
      listPageSelected(params).then(response => {
        this.table.data = response.data.list.map(item => {
          return Object.assign({}, item, {propertyDetailId: item.id});
        });
        this.pagination.total = response.data.total;
        this.table.loading = false;
      });
    },

    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },

    pageChange() {
      this.loadData();
    },

    selectionChange(selection){
      this.selection = selection;
    },

    confirmAndClose(close_modal) {
      if(close_modal) this.show = false; 
      this.$emit("selection-choosed", this.selection);
    },

  }
};
</script>

