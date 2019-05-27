<style lang="less" scoped>
.gvt-layout {
  .ivu-form-item {
    margin-bottom: 10px;
  }
}
</style>


<template>
  <gvt-layout>
    
    <template slot="title">{{$t("product.manage.titleQuery")}}</template>

    <template slot="search">
      <Form inline :label-width="100" ref="search-form" :model="form.data">
        <FormItem :label="$t('product.manage.itemNo')" prop="itemNo">
          <Input type="text" v-model="form.data.itemNo"></Input>
        </FormItem>
        <FormItem :label="$t('product.manage.barCode')" prop="barCode">
          <Input type="text" v-model="form.data.barCode"></Input>
        </FormItem>
        <FormItem :label="$t('product.manage.name')" prop="name">
          <Input type="text" v-model="form.data.name"></Input>
        </FormItem>
        <FormItem :label="$t('product.manage.brand')" prop="brand">
          <Select style="width: 147px" transfer v-model="form.data.brand" ref="select-brand" filterable>
            <Option v-for="(item, index) in brands" :key="item.id + '.' + index" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('product.manage.category')">
          <Cascader :data="categories" transfer filterable :value="category" @on-change="categoryChange"></Cascader>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData">{{$t("common.search")}}</Button>
          <Button type="ghost" @click="resetForm">{{$t("common.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="$router.push({name: 'product-manage-create'})">{{$t("common.create")}}</Button>
    </template>

    <template slot="data-title">{{$t("product.manage.titleList")}}</template>

    <template slot="data-table">
      <Table :loading="table.loading" :height="$layout.tableHeight" :data="table.data" :columns="table.cols"></Table>
    </template>

    <template slot="data-page">
      <gvt-page :pagination="pagination" @on-page-size-change="loadData(true)" @on-page-change="loadData()"></gvt-page>
    </template>

  </gvt-layout>
</template>

<script>
import { PAGE_PARAMS } from "../../../constants";
import { listPage } from "../../../api/product";
import { list as brandList } from "../../../api/brand";
import { listTree as categoryList } from "../../../api/category";
import { layout_break } from "../../../mixins/layout";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_break],

  data() {
    return {
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
                    type: "text"
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "product-manage-edit",
                        query: {id: params.row.id}
                      })
                    }
                  }
                },
                i18n.t("common.edit")
              );
            }
          },
          {
            title: i18n.t("product.manage.image"),
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
            title: i18n.t("product.manage.name"),
            key: "name"
          },
          {
            title: i18n.t("product.manage.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.manage.brand"),
            key: "brand"
          },
          {
            title: i18n.t("product.manage.category"),
            key: "category"
          },
          {
            title: i18n.t("product.manage.origin"),
            key: "origin"
          }
        ]
      },
      visible: false
    };
  },

  created() {
    this.fetchBrands();
    this.fetchCategories();
    this.loadData();
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

  methods: {
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
      this.$refs["select-brand"].reset();
      this.form.data.category = "";
      this.category = [];
    }
  }
};
</script>

