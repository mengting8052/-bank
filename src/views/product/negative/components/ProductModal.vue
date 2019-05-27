<template>
  <Modal
    v-model="show"
    width="1000"
    :styles="{top: '40px'}"
    :closable="false"
    :title="$t('product.negative.modal.title')"
    @on-visible-change="visibleChange"
  >
    <Form inline :label-width="80" ref="search-form" :model="form">
      <FormItem :label="$t('product.tenant.component.productModal.itemNo')" prop="itemNo">
        <Input type="text" v-model="form.itemNo"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.barCode')" prop="barCode">
        <Input type="text" v-model="form.barCode"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.name')" prop="productName">
        <Input type="text" v-model="form.productName"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.shortName')" prop="shortName">
        <Input type="text" v-model="form.shortName"></Input>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.brand')" prop="brandId">
        <Select v-model="form.brandId" style="width: 147px;" filterable ref="brandSelect">
          <Option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('product.tenant.component.productModal.category')" prop="classId">
        <Cascader :data="categories" :value="category" filterable @on-change="categoryChange"></Cascader>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
        <Button type="ghost" @click="resetData">{{$t("common.reset")}}</Button>
      </FormItem>
    </Form>

    <Table
      :height="540"
      :loading="table.loading"
      :data="table.data"
      :columns="table.cols"
      @on-selection-change="selectionChange"
    ></Table>

    <div style="margin-top: 10px;text-align: right;">
      <gvt-page
        :pagination="pagination"
        @on-page-change="loadData()"
        @on-page-size-change="loadData(true)"
      ></gvt-page>
    </div>

    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirmAndClose(false)">{{$t("common.choose")}}</Button>
      <Button type="primary" @click="confirmAndClose(true)">{{$t("common.confirmAndChoose")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { gvtList as brandList } from "../../../../api/brand";
import { gvtListTree as categoryList } from "../../../../api/category";
import { getPageProductList as productList, save as productSave } from "../../../../api/productNegative.js";
import { PAGE_PARAMS } from "../../../../constants";
import { i18n } from "../../../../setup/i18n-setup.js";

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
        shortName: "",
        brandId: "",
        classId: "",
        itemNo: "",
        productName: ""
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
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.negative.gvtBarCode"),
            key: "gvtBarCode"
          },
          {
            title: i18n.t("product.negative.itemNo"),
            key: "itemNo"
          },
          {
            title: i18n.t("product.negative.barCode"),
            key: "barCode"
          },
          {
            title: i18n.t("product.negative.productName"),
            key: "productName"
          },
          {
            title: i18n.t("product.negative.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.negative.model"),
            key: "model"
          },
          {
            title: i18n.t("product.negative.property"),
            key: "property"
          }
        ]
      },

      pagination: Object.assign({}, PAGE_PARAMS),

      selection: [],
    };
  },

  watch: {
    category(val) {
      if (val && val.length) {
        this.form.classId = val[1];
      } else {
        this.form.classId = "";
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
    selectionChange(selection) {
      this.selection = selection
    },

    confirmAndClose(close = false) {
      if(!this.selection.length) {
        this.$Message.error(i18n.t("product.negative.modal.productRequired"))
        return
      }
      const negativeDTOS = this.selection.map(item => ({ gvtBarcode: item.gvtBarCode, productId: item.productId }))
      productSave({negativeDTOS}).then(response => {
        this.$emit("on-success")
        close && (this.show = false)
        this.$Message.success(i18n.t("common.success"))
      }).catch(error => {
        this.$Message.error(error.message)
      })
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
          this.$Message.error(error.message);
          this.table.loading = false;
        });
    },

    fetchBrands() {
      brandList().then(response => {
        this.brands = response.data;
      });
    },

    resetData() {
      this.$refs["search-form"].resetFields();
      this.$refs["brandSelect"].setQuery(null);
      this.category = [];
    },

    fetchCategories() {
      categoryList().then(response => {
        this.categories = response.data;
      });
    },

    categoryChange(value) {
      this.category = value.map(item => parseInt(item));
    },

    visibleChange(visible) {
      if (!visible) {
        this.resetData();
        this.selection = [];
        this.loadData(true);
      }
    }
  }
};
</script>
