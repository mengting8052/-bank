<template>
  <Modal :title="$t('product.tenant.component.skuModal.title')" v-model="show" width="900" :styles="{'z-index': 9999}">
    <Table :height="540" :loading="table.loading" :data="table.data" :columns="table.cols">
    </Table>

    <div style="margin-top:10px; text-align:right;">
      <gvt-page :pagination="pagination" @on-page-change="loadData" @on-page-size-change="loadData(true)"></gvt-page>
    </div>

    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { gvtListPage as skuList } from "../../../../api/product";
import { PAGE_PARAMS } from "../../../../constants";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  props: {
    visible: [Boolean],
    productId: [Number, String]
  },

  data() {
    return {
      show: this.visible,

      pagination: Object.assign({}, PAGE_PARAMS),

      table: {
        loading: false,
        data: [],
        cols: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.tenant.component.skuModal.image"),
            width: 100,
            align: "center",
            render: (h, params) => {
              if(params.row.skuImage) {
                return h("img", {
                  class: ["product-img-thumb"],
                  domProps: {
                    src: params.row.skuImage
                  }
                })
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: i18n.t("product.tenant.component.skuModal.name"),
            key: "name",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.itemNo"),
            key: "itemNo",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.barCode"),
            key: "barCode",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.skuCode"),
            key: "skuCode",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.model"),
            key: "model",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.unit"),
            key: "unit",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.brand"),
            key: "brand",
            width: 250
          },
          {
            title:i18n.t("product.tenant.component.skuModal.category"),
            key: "category",
            width: 250
          },
          {
            title: i18n.t("product.tenant.component.skuModal.weight"),
            key: "weight",
            width: 250
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
    },
    productId(val) {
      this.loadData(true);
    }
  },

  methods: {
    loadData(reload = false) {
      if (reload) this.pagination.current = 1;
      this.table.loading = true;
      const params = Object.assign(
        {},
        { productId: this.productId },
        { pageSize: this.pagination.pageSize, pageNum: this.pagination.current }
      );
      skuList(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    }
  }
};
</script>
