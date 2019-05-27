<template>
  <Modal v-model="show" :title="$t('product.basicRateModal.title')" width="700">
    <Form inline :label-width="80" ref="searchForm" :model="form">
      <FormItem :label="$t('product.basicRateModal.area')">
        <Cascader :data="nations" v-model="area" change-on-select @on-change="areaChange"></Cascader>
      </FormItem>
      <FormItem :label="$t('product.basicRateModal.gvtCode')">
        <Input type="text" v-model="form.gvtCode"></Input>
      </FormItem>
      <FormItem :label="$t('product.basicRateModal.hscode')">
        <Input type="text" v-model="form.hscode"></Input>
      </FormItem>
      <FormItem :label="$t('product.basicRateModal.name')">
        <Input type="text" v-model="form.name"></Input>
      </FormItem>
      <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
      <Button type="ghost" @click="resetForm">{{$t("common.reset")}}</Button>
    </Form>

    <Table :height="400" :data="table.data" :loading="table.loading" :columns="table.columns" @on-selection-change="selectionChange"></Table>

    <div style="text-align: right;margin-top: 20px;">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData()"
      ></gvt-page>
    </div>

    <div slot="footer">
      <Button type="ghost" @click="cancel">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirmAndClose()">{{$t("common.choose")}}</Button>
      <Button type="primary" @click="confirmAndClose(true)">{{$t("common.confirmAndChoose")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { PAGE_PARAMS } from "../../../../../constants";
import { list } from "../../../../../api/tax";
import { listPageHscodesSelect } from "../../../../../api/hscodes";
import { i18n } from "../../../../../setup/i18n-setup.js"

export default {
  props: {
    visible: Boolean
  },

  data() {
    return {
      show: this.visible,

      nations: [],

      area: [],

      form: {
        nation: "",
        nationCode: "",
        provinceCode: "",
        province: "",
        name: "",
        hscode: "",
        gvtCode: ""
      },

      pagination: Object.assign({}, PAGE_PARAMS),

      table: {
        loading: false,
        data: [],
        columns: [
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
            title: i18n.t("product.basicRateModal.nation"),
            key: "nation",
          },
          {
            title: i18n.t("product.basicRateModal.area"),
            key: "province"
          },
          {
            title: i18n.t("product.basicRateModal.gvtCode"),
            key: "gvtCode"
          },
          {
            title: i18n.t("product.basicRateModal.hscode"),
            key: "hscode"
          },
          {
            title: i18n.t("product.basicRateModal.name"),
            key: "name"
          },
        ]
      },

      selection: []
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
    this.initTax();
    this.loadData();
  },

  methods: {
    initTax() {
      list().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.label = item.nation;
          obj.value = item.nationCode;
          obj.type = "nationCode";
          obj.children = [];
          if (item.provinces && item.provinces.length) {
            obj.children = item.provinces.map(v => {
              return {
                label: v.province,
                value: v.provinceCode,
                type: "provinceCode"
              };
            });
          }
          this.nations.push(obj);
        });
      });
    },

    areaChange(value, selectedData) {
      if (selectedData.length) {
        if (selectedData.length === 1) {
          this.form.nation = selectedData[0]["label"];
          this.form.nationCode = selectedData[0]["value"];
          this.form.province = "";
          this.form.provinceCode = "";
        } else {
          this.form.nation = selectedData[0]["label"];
          this.form.nationCode = selectedData[0]["value"];
          this.form.province = selectedData[1]["label"];
          this.form.provinceCode = selectedData[1]["value"];
        }
      } else {
        this.form.nation = "";
        this.form.nationCode = "";
        this.form.province = "";
        this.form.provinceCode = "";
      }
    },

    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.current = 1);
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      listPageHscodesSelect(params)
        .then(response => {
          this.pagination.total = response.data.total;
          this.table.data = response.data.list;
          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    resetForm() {
      this.area = [];
      this.form.nation = this.form.nationCode = this.form.province = this.form.provinceCode =
        "";
      this.$refs["searchForm"].resetFields();
    },

    cancel() {
      this.show = !this.show
    },

    confirmAndClose(close = false) {
      close && (this.show = !this.show)
      this.$emit("on-choosed", this.selection)
    },

    selectionChange(selection) {
      this.selection = selection;
    }
  }
};
</script>
