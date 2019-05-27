<style lang="less" scoped>
.gvt-layout {
  .ivu-form-item {
    margin-bottom: 10px;
  }
}
</style>


<template>
  <gvt-layout disBtnGroups>
   
    <template slot="title">{{$t("product.verify.titleQuery")}}</template>
    <template slot="search">
      <Form inline :label-width="80" ref="search-form" :model="form.data">
        <FormItem :label="$t('product.verify.number')" prop="number">
          <Input type="text" v-model="form.data.number"></Input>
        </FormItem>
        <FormItem :label="$t('product.verify.barcode')" prop="barcode">
          <Input type="text" v-model="form.data.barcode"></Input>
        </FormItem>
        <FormItem :label="$t('product.verify.tenantProductName')" prop="tenantProductName">
          <Input type="text" v-model="form.data.tenantProductName"></Input>
        </FormItem>
        <FormItem :label="$t('product.verify.brandName')" prop="brandName">
          <Input type="text" v-model="form.data.brandName"></Input>
        </FormItem>
        <br>
        <FormItem :label="$t('product.verify.className')" prop="className">
          <Input type="text" v-model="form.data.className"></Input>
        </FormItem>
        <FormItem :label="$t('product.verify.tenantId')" prop="tenantId">
          <Select v-model="form.data.tenantId" style="width: 147px" clearable>
            <Option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('product.verify.status')" prop="status">
          <Select style="width: 147px;" v-model="form.data.status" clearable filterable ref="select-status">
            <Option :value="0">{{$t("product.verify.status_0")}}</Option>
            <Option :value="1">{{$t("product.verify.status_1")}}</Option>
            <Option :value="2">{{$t("product.verify.status_2")}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData">{{$t("common.search")}}</Button>
          <Button type="ghost" @click="reset">{{$t("common.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="data-title">{{$t("product.verify.titleList")}}</template>

    <template slot="data-table">
      <Table :height="$layout.tableHeight" :loading="table.loading" :data="table.data" :columns="table.cols"></Table>
    </template>

    <template slot="data-page">
      <gvt-page :pagination="pagination" @on-page-size-change="loadData(true)" @on-page-change="loadData()"></gvt-page>
    </template>

  </gvt-layout>
</template>

<script>
import { PAGE_PARAMS } from "../../../constants";
import { productAuditList, tenantAuditList } from "../../../api/productAudit";
import { layout_break } from "../../../mixins/layout";
import { i18n } from "../../../setup/i18n-setup"

export default {
  mixins: [layout_break],

  data() {
    return {
      showGroups: false,
      tenants: [],
      pagination: Object.assign({}, PAGE_PARAMS),
      form: {
        data: {
          barcode: "",
          brandName: "",
          className: "",
          numebr: "",
          status: "",
          tenantId: "",
          tenantProductName: ""
        },
        rules: {}
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
            title: i18n.t("common.operate"),
            key: "CRUD",
            align: "center",
            render: (h, params) => {
              return h(
                "Button",
                {
                  props: {
                    type: "text",
                    disabled: params.row.status == 0 ? false : true
                  },
                  on: {
                    click: () => {
                      this.$router.push({name: "product-verify-edit", query: {id: params.row.id, tenantProductId: params.row.tenantProductId}})
                    }
                  },
                  class: ["edit-btn"]
                },
                i18n.t("product.verify.verify")
              );
            }
          },
          {
            title: i18n.t("product.verify.status"),
            key: "status",
            render: (h, params) => {
              const status = params.row.status;
              let text = "";
              switch (status) {
                case 1:
                  text = i18n.t("product.verify.status_1");
                  break;
                case 2:
                  text = i18n.t("product.verify.status_2");
                  break;
                default:
                  text = i18n.t("product.verify.status_0");
              }
              return h("span", text);
            }
          },
          {
            title: i18n.t("product.verify.tenantId"),
            key: "tenantName"
          },
          {
            title: i18n.t("product.verify.tenantProductName"),
            key: "tenantProductName"
          },
          {
            title: i18n.t("product.verify.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.verify.className"),
            key: "className"
          },
          {
            title: i18n.t("product.verify.brandName"),
            key: "brandName"
          },
          {
            title: i18n.t("product.verify.createTime"),
            key: "createTime",
            render: (h, params) => {
              return h(
                "span",
                this.$options.filters.timeFormat(params.row.createTime)
              );
            }
          }
        ]
      }
    };
  },

  created() {
    this.loadData();
    this.fetchTenants();
  },

  methods: {
    fetchTenants(){
      tenantAuditList().then(response => {
        this.tenants = response.data;
      })
    },

    loadData(reload = false) {
      if (reload) this.pagination.current = 1;

      const params = Object.assign({}, this.form.data, {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      });
      this.table.loading = true;

      productAuditList(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    reset() {
      this.$refs["search-form"].resetFields()
      this.$refs["select-status"].reset()
    }
  }
};
</script>

