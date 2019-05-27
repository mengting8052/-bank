<style lang="less" scoped>
.result-wrapper {
  float: left;
  .total,
  .btns {
    display: inline-block;
  }
  .total {
    height: 30px;
    vertical-align: sub;
    .result {
      margin: 0 10px 0 5px;
      font-size: 18px;
      color: #ff0000;
    }
  }
}
</style>


<template>
  <gvt-layout-tree>
    <template slot="title">
      {{$t("product.tenant.batchAdd.titleQuery")}}
    </template>   
    
    <template slot="search">
      <Form inline :label-width="80" ref='searchForm' :model='form'>
        <FormItem :label="$t('product.tenant.batchAdd.itemNo')" prop='itemNo'>
          <Input type="text" v-model="form.itemNo"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.batchAdd.barCode')" prop='barCode'>
          <Input type="text" v-model="form.barCode"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.batchAdd.name')" prop='name'>
          <Input type="text" v-model="form.name"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.batchAdd.brand')" prop='brand'>
          <Select v-model="form.brand" style="width: 147px;" filterable ref="brand-select">
            <Option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t("common.confirm")}}</Button>
          <Button  style="margin-left: 8px" type="ghost" @click="resetForm">{{$t("common.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="data-title">{{$t("product.tenant.batchAdd.titleList")}}</template>

    <template slot="data-tree">
      <Tree :data="categories" @on-select-change="categoryChange"></Tree>
    </template>

    <template slot="data-table">
      <Table 
        :height="$layoutTree.tableHeight" 
        :loading="table.loading" 
        :data="table.data" 
        :columns="table.cols"
        @on-select="select"
        @on-select-cancel="selectCancel"
        @on-select-all="selectAll"
        @on-selection-change="selectionChange">
      </Table>
    </template>

    <template slot="data-page">
      <div class="result-wrapper">
        <div class="total">
          {{$t("product.tenant.batchAdd.choosed")}}<span class="result">{{ idList.length }}</span>
        </div>
        <div class="btns">
          <Button type="primary" @click="confirm" :loading="btnLoading" :disabled="idList.length === 0">{{$t("common.confirm")}}</Button>
          <Button type="ghost" @click="$router.push({name: 'product-tenant-list'})">{{$t("common.cancel")}}</Button>
        </div>
      </div>
      <gvt-page :pagination="pagination" @on-page-change="loadData" @on-page-size-change="loadData(true)"></gvt-page>
    </template>
    <sku-modal :visible.sync="visible" :product-id="productId"></sku-modal>
  </gvt-layout-tree> 

</template>

<script>
import { gvtList as brandList } from "../../../api/brand";
import { gvtListTree as categoryList } from "../../../api/category";
import {
  gvtListPageForBatch as productList,
  batchAdd
} from "../../../api/product";
import { PAGE_PARAMS } from "../../../constants";
import { layout_tree_break } from "../../../mixins/layout-tree-break";
import skuModal from "./components/skuModal";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_tree_break],

  components: { skuModal },

  data() {
    return {
      btnLoading: false,

      visible: false,

      productId: 0,

      categories: [
        {
          title: i18n.t("product.tenant.batchAdd.allCategory"),
          expand: true,
          disabled: true,
          children: []
        }
      ],

      brands: [],

      pagination: Object.assign({}, PAGE_PARAMS),

      form: {
        barCode: "",
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
            type: "selection",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("product.tenant.batchAdd.name"),
            key: "name"
          },
          {
            title: i18n.t("product.tenant.batchAdd.brand"),
            key: "brand"
          },
          {
            title: i18n.t("product.tenant.batchAdd.category"),
            key: "category"
          },
          {
            title: i18n.t("product.tenant.batchAdd.sku"),
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
                      this.productId = params.row.id;
                      this.visible = true;
                    }
                  }
                },
                i18n.t("product.tenant.batchAdd.detail")
              );
            }
          }
        ]
      },

      idList: []
    };
  },

  created() {
    this.fetchBrands();
    this.fetchCategories();
    this.loadData();
  },

  methods: {
    confirm() {
      this.btnLoading = true;
      batchAdd(this.idList)
        .then(response => {
          this.$Message.success(i18n.t("common.success"));
          this.$router.push({ name: "product-tenant-list" });
          this.btnLoading = false;
        })
        .catch(error => {
          this.$Message.error(error.message);
          this.btnLoading = false;
        });
    },

    addItem(id) {
      this.idList.push(id);
      this.idList = [...new Set(this.idList)];
    },

    removeItem(id) {
      this.idList = this.idList.filter(v => v !== id);
    },

    // 选中某一项
    select(selection, row) {
      const id = row.id;
      this.table.data.map(item => {
        if (item.id === row.id) {
          item._checked = true;
          this.addItem(item.id);
          return;
        }
      });
    },

    // 取消某一项
    selectCancel(selection, row) {
      const id = row.id;
      this.table.data.map(item => {
        if (item.id === row.id) {
          item._checked = false;
          this.removeItem(item.id);
          return;
        }
      });
    },

    // 全选
    selectAll(selection) {
      this.table.data.map(item => {
        item._checked = true;
        this.addItem(item.id);
      });
    },

    // 选项变化
    selectionChange(selection) {
      if (selection.length === 0) {
        this.table.data.map(item => {
          item._checked = false;
          this.removeItem(item.id);
        });
      }
    },

    categoryChange(arr) {
      // 一级分类点击时不调接口
      if (arr.length === 0) {
        this.form.category = "";
        this.loadData(true);
      } else {
        arr[0]["expand"] = true
        if(arr[0]["children"].length === 0) {
          this.form.category = arr[0]["id"];
          this.loadData(true);
        }
      }
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
          this.table.data = response.data.list.map(item => {
            if (this.idList.indexOf(item.id) === -1) {
              item._checked = false;
            } else {
              item._checked = true;
            }
            return item;
          });
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    fetchBrands() {
      brandList().then(response => {
        this.brands = response.data;
      });
    },

    fetchCategories() {
      categoryList().then(response => {
        response.data.map(item => {
          if (item.children && item.children.length) {
            let obj = {
              id: item.value,
              title: item.label,
              name: item.label,
              expand: false,
              children: []
            };
            item.children.map(v => {
              obj.children.push({
                id: v.value,
                title: v.label,
                name: v.label,
                children: []
              });
            });
            this.categories[0]["children"].push(obj);
          }
        });
      });
    },

    resetForm(){
      this.$refs['searchForm'].resetFields();
      this.$refs['brand-select'].setQuery(null);
    }
  }
};
</script>
