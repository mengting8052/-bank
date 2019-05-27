<style lang="less" scoped>
.header-wrapper {
  font-size: 18px;
  span {
    font-size: 14px;
    color: #a1a1a1;
  }
}
</style>


<template>
  <Modal v-model="show" width="1000" :styles="{top: '40px'}" :closable="false" @on-visible-change="visibleChange">
    <div class="header-wrapper" slot="header">
      {{$t('product.tenant.component.productModal.title')}}
      <span>{{$t('product.tenant.component.productModal.notice')}}</span>
    </div>
    <Form inline :label-width="80" ref="search-form" :model="form">
      <FormItem :label="$t('product.tenant.component.productModal.itemNo')" prop="itemNo">
        <Input type="text" v-model="form.itemNo"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.barCode')" prop="barCode">
        <Input type="text" v-model="form.barCode"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.name')" prop="name">
        <Input type="text" v-model="form.name"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.shortName')" prop="shortName">
        <Input type="text" v-model="form.shortName"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.brand')" prop="brand">
        <Select v-model="form.brand" style="width: 147px;" filterable ref="brandSelect">
          <Option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.category')" prop="category">
        <Cascader :data="categories" :value="category" filterable @on-change="categoryChange"></Cascader>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
        <Button type="ghost" @click="resetData">{{$t("common.reset")}}</Button>
      </FormItem>
    </Form>

    <Table :height="540" highlight-row :loading="table.loading" :data="table.data" :columns="table.cols" @on-current-change="tableChange"></Table>
    
    <div style="margin-top: 10px;text-align: right;">
      <gvt-page :pagination="pagination" @on-page-change="loadData()" @on-page-size-change="loadData(true)"></gvt-page>
    </div>

    <div slot="footer">
      <Row>
        <Col span="12" style="text-align: left;">
          <Button type="ghost" @click="$router.push({name: 'product-tenant-create'})" >
            {{$t('product.tenant.component.productModal.fullCreate')}}  
          </Button> 
          <Button type="ghost" @click="$router.push({name: 'product-tenant-fastCreate'})"> 
            {{$t('product.tenant.component.productModal.fastCreate')}}  
          </Button> 
        </Col>
        <Col span="12">
          <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button> 
          <Button type="primary" :disabled="current_product_id == 0" @click="confirm">{{$t("common.confirm")}}</Button> 
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
import { gvtList as brandList } from "../../../../api/brand";
import { gvtListTree as categoryList } from "../../../../api/category";
import { gvtListPageForBatch as productList } from "../../../../api/product";
import { PAGE_PARAMS } from "../../../../constants";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {

  props: {
    visible: [Boolean]
  },

  data() {
    return {
      show: this.visible,

      categories: [],

      category: [],

      brands: [],

      form: {
        barCode: "",
        shortName:"",
        brand: "",
        category: "",
        itemNo: "",
        name: ""
      },

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
            title: i18n.t("product.tenant.component.productModal.name"),
            key: "name"
          },
          {
            title: i18n.t("product.tenant.component.productModal.brand"),
            key: "brand"
          },
          {
            title: i18n.t("product.tenant.component.productModal.category"),
            key: "category"
          },
          {
            title: i18n.t("product.tenant.component.productModal.skuDetail"),
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
                      this.current_product_id = params.row.id;
                      this.$emit("sku-btn-click", params.row.id);
                    }
                  }
                },
                i18n.t("product.tenant.component.productModal.detail")
              );
            }
          }
        ]
      },

      pagination: Object.assign({}, PAGE_PARAMS),

      current_product_id: 0
    };
  },

  watch: {
    category(val) {
      if (val && val.length) {
        this.form.category = val[1];
      } else {
        this.form.category = "";
      }
    },
    visible(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {
    this.fetchBrands();
    this.fetchCategories();
    this.loadData();
  },

  methods: {
    confirm() {
      const id = this.current_product_id;
      this.$router.push({ name: "product-tenant-edit", query: { id: id, gvt: true } });
    },

    tableChange(currentRow, oldCurrentRow) {
      this.current_product_id = currentRow.id;
    },

    loadData(reload = false) {
      if (reload) this.pagination.current = 1;
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      productList(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.$Message.error(error.message)
          this.table.loading = false;
        });
    },

    fetchBrands() {
      brandList().then(response => {
        this.brands = response.data;
      });
    },

    resetData(){
      this.$refs["search-form"].resetFields();
      this.$refs["brandSelect"].setQuery(null)
      this.category=[];
    },

    fetchCategories() {
      categoryList().then(response => {
        this.categories = response.data
      });
    },

    categoryChange(value) {
      this.category = value.map(item => parseInt(item))
    },

    visibleChange(visible) {
      if(!visible) {
        this.resetData()
        this.current_product_id = 0
        this.loadData(true)
      }
    }
  }
};
</script>
