
<style lang="less" scoped>
.gvt-layout {
  .ivu-form-item {
    margin-bottom: 10px;
  }
}
</style>


<template>

  <gvt-layout>
    
    <template slot="title">{{$t("product.tenant.titleQuery")}}</template>

    <template slot="search">
      <Form inline :label-width="80" ref="search-form" :model="form.data">
        <FormItem :label="$t('product.tenant.itemNo')" prop="itemNo">
          <Input type="text" v-model="form.data.itemNo"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.barCode')" prop="barCode">
          <Input type="text" v-model="form.data.barCode"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.name')" prop="name">
          <Input type="text" v-model="form.data.name"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.brand')" prop="brand">
          <Select style="width: 147px" transfer v-model="form.data.brand" filterable ref="brand-select">
            <Option v-for="item in brands" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('product.tenant.category')" prop="category">
          <Cascader :data="categories" transfer :value="category" filterable @on-change="categoryChange"></Cascader>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData">{{$t("common.search")}}</Button>
          <Button type="ghost" @click="resetForm">{{$t("common.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="visible = !visible">{{$t("common.create")}}</Button>
      <Button  type="primary" @click="$router.push({name: 'product-tenant-batchAdd'})">{{$t("common.batchCreate")}}</Button>
    </template>

    <template slot="data-title">{{$t("product.tenant.titleList")}}</template>

    <template slot="data-table">
      <Table :loading="table.loading" :data="table.data" :columns="table.cols"></Table>
    </template>

    <template slot="data-page">
      <gvt-page :pagination="pagination" @on-page-size-change="loadData(true)" @on-page-change="loadData()"></gvt-page>
    </template>

    <product-modal :visible.sync="visible" @sku-btn-click="skuBtnClick"></product-modal>
    <sku-modal :visible.sync="skuVisible" :product-id="skuProductId"></sku-modal>

  </gvt-layout>
  
</template>

<script>
import { PAGE_PARAMS } from "../../../constants";
import { listPage } from "../../../api/product";
import { list as brandList } from "../../../api/brand";
import { listTree as categoryList } from "../../../api/category";
import productModal from "./components/productModal";
import skuModal from "./components/skuModal";
import { i18n } from "../../../setup/i18n-setup"

export default {
  components: { productModal, skuModal },

  data() {
    return {
      visible: false,

      skuVisible: false,
      skuProductId: "",

      pagination: Object.assign({}, PAGE_PARAMS),

      form: {
        data: {
          barCode: "",
          brand: "",
          category: "",
          itemNo: "",
          name: ""
        },
        rules: {}
      },

      brands: [],

      categories: [],

      category: [],

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
            title: i18n.t("common.operate"),
            key: "CRUD",
            align: "center",
            render: (h, params) => {
              return h(
                "Button",
                {
                  props: {
                    type: "text",
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.$router.push({name: "product-tenant-edit", query: {id: params.row.id}})
                    }
                  }
                },
                i18n.t("common.edit")
              );
            }
          },
          {
            title: i18n.t("product.tenant.image"),
            width: 120,
            align: "center",
            render: (h, params) => {
              if(params.row.image) {
                return h("img", {
                  class: ["product-img-thumb"],
                  domProps: {
                    src: params.row.image
                  }
                })
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: i18n.t("product.tenant.name"),
            key: "name"
          },
          {
            title: i18n.t("product.tenant.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.tenant.brand"),
            key: "brand"
          },
          {
            title: i18n.t("product.tenant.category"),
            key: "category"
          },
          {
            title: i18n.t("product.tenant.origin"),
            key: "origin"
          }
        ]
      },
    };
  },

  watch: {
    category(val) {
      if (val && val.length) {
        this.form.data.category = val[1];
      } else {
        this.form.data.category = "";
      }
    }
  },

  created() {
    this.fetchBrands();
    this.fetchCategories();
    this.loadData();
  },

  methods: {
    skuBtnClick(productId) {
      this.skuProductId = productId;
      this.skuVisible = true;
    },

    fetchBrands() {
      brandList().then(response => (this.brands = response.data));
    },

    fetchCategories() {
      categoryList().then(response => {
        this.categories = response.data;
      });
    },

    categoryChange(value) {
      this.category = value.map(item => parseInt(item))
    },

    loadData(reload = false) {
      if (reload) this.pagination.current = 1;

      const params = Object.assign({}, this.form.data, {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      });

      this.table.loading = true;

      listPage(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    resetForm() {
      this.$refs["search-form"].resetFields();
      this.$refs["brand-select"].setQuery(null);
      this.category = [];
    }
  }
};
</script>

