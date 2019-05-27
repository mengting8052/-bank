<template>
  <Modal :title="$t('components.selectProduct.title')" v-model="show" width="900">
    <div class="search">
      <Form inline ref="search-form" :label-width="80" :model="form">
        <FormItem :label="$t('components.selectProduct.itemNo')" prop="itemNo">
          <Input v-model="form.itemNo" style="width:200px" clearable></Input>
        </FormItem>
        <FormItem :label="$t('components.selectProduct.barCode')" prop="barCode">
          <Input v-model="form.barCode" style="width:200px" clearable></Input>
        </FormItem>
        <FormItem :label="$t('components.selectProduct.name')" prop="name">
          <Input v-model="form.name" style="width:200px" clearable></Input>
        </FormItem>
        <FormItem :label="$t('components.selectProduct.shortName')" prop="shortName">
          <Input v-model="form.shortName" style="width:200px" clearable></Input>
        </FormItem>
        <FormItem :label="$t('components.selectProduct.customId')" prop="customId">
          <Select v-model="form.brand" style="width:200px" clearable>
            <Option v-for="item in brands" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('components.selectProduct.category')" prop="category">
          <Cascader :data="categories" v-model="category" style="width:200px"></Cascader>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData">{{$t('common.search')}}</Button>
          <Button type="ghost" @click="resetForm">{{$t('common.reset')}}</Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <Table
        :data="table.data"
        ref="productListTable"
        :columns="table.clos"
        :loading="table.loading"
        highlight-row
        @on-current-change="selectRow"
        :height="400"
      ></Table>
    </div>
    <gvt-page
        style="margin-top: 10px;text-align: right;"
      :pagination="pagination"
      @on-page-size-change="pageSizeChange"
      @on-page-change="pageChange"
    ></gvt-page>

    <template slot="footer">
      <Button type="ghost" @click="close">{{$t('common.cancel')}}</Button>
      <Button type="primary" @click="selectTable">{{$t('common.confirm')}}</Button>
    </template>
  </Modal>
</template>
<script>
import { PAGE_PARAMS } from "../../../../constants";
import { listPageProductSku } from "../../../../api/productWearHouse.js";
import { list } from "../../../../api/brand.js";
import { listTree as categoryList } from "../../../../api/category";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  props: {
    tableShow: {
      type: Boolean,
      default: false
    },
    modal: {
      type: String
    }
  },
  data() {
    return {
      form: {
        //  商品货号
        itemNo: "",
        //  条形码
        barCode: "",
        // 商品名称
        name: "",
        // 商品简称
        shortName: "",
        // 商品品牌
        brand: "",
        //商品分类
        category: ""
      },
      show: this.tableShow,
      category: [],
      table: {
        loading: false,
        clos: [
          {
            title: "#",
            type: "index"
          },
          {
            title: i18n.t("components.selectProduct.itemNo"),
            key: "itemNo"
          },
          {
            title: i18n.t("components.selectProduct.barCode"),
            key: "barCode"
          },
          {
            title: i18n.t("components.selectProduct.name"),
            key: "name"
          },
          {
            title: i18n.t("components.selectProduct.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("components.selectProduct.skuCode"),
            key: "skuCode"
          },
          {
            title: i18n.t("components.selectProduct.model"),
            key: "model"
          },
          {
            title: i18n.t("components.selectProduct.property"),
            key: "property"
          }
        ],
        data: []
      },
      pagination: Object.assign({}, PAGE_PARAMS),
      selectData: {},
      brands: [],
      categories: []
    };
  },
  watch: {
    tableShow(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:tableShow", val);
    },
    category(val) {
      //检测分类数据的变化  接口要求字符串格式
      if (val && val.length) {
        val.length === 2
          ? (this.form.category = val[1])
          : (this.form.category = val[0]);
      } else {
        this.form.category = "";
      }
    }
  },
  mounted() {
    this.loadData();
    this.getList();
    this.fetchCategories();
  },

  methods: {
    resetForm() {
      this.$refs["search-form"].resetFields();
      this.category = [];
      this.form.brand = "";
    },
    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },
    pageChange() {
      this.loadData();
    },
    loadData() {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      listPageProductSku(params)
        .then(response => {
          this.pagination.total = response.data.total;
          this.table.data = response.data.list;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    //选中表格中的某一行
    selectRow(currentRow) {
      this.selectData = currentRow;
    },
    //点击弹窗确定
    selectTable() {
      if (this.selectData === "") {
        this.$Message.error(i18n.t("components.selectProduct.errorMsg"));
        return;
      } else {
        this.$emit("success", {
          selectData: this.selectData,
          modal: this.modal
        });
        this.show = false;
      }
    },
    // 取消
    close() {
      this.$refs.productListTable.clearCurrentRow();
      this.show = false;
    },
    //品牌列表数据
    getList() {
      list().then(response => {
        this.brands = response.data.map(item => {
          item.value = item.id;
          item.label = item.name;
          return item;
        });
      });
    },
    // 获取分类列表
    fetchCategories() {
      categoryList().then(response => {
        this.categories = response.data;
      });
    }
  }
};
</script>
