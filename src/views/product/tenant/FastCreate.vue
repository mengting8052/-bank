<template>
  <div>
    <Card dis-hover>
      <p slot="title">{{$t("product.tenant.fastCreate.title")}}</p>
      <Form inline ref="fast-create-form" :model="form.data" :rules="form.rules" :label-width="90">
        <FormItem :label="$t('product.tenant.fastCreate.name')" prop="name">
          <Input v-model="form.data.name" style="width:200px"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.itemNo')" prop="itemNo">
          <Input v-model="form.data.itemNo" style="width:200px"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.barCode')" prop="barCode">
          <Input v-model="form.data.barCode" style="width:200px"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.brandId')" prop="brandId">
          <Select transfer v-model="form.data.brandId" style="width:200px" filterable>
            <Option v-for="item in brands" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('product.tenant.fastCreate.classId')" prop="classId">
          <Cascader
            :data="categories"
            transfer
            :value="classify"
            style="width:200px"
            @on-change="categoryChange"
            filterable
          ></Cascader>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.ptId')" prop="ptId">
          <Cascader
            :data="splitPackages"
            transfer
            v-model="splitList"
            style="width:200px"
            filterable
          ></Cascader>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.model')" prop="model">
          <Input v-model="form.data.model" style="width:200px"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.unitName')" prop="unitName">
          <Input v-model="form.data.unitName" style="width:200px"></Input>
        </FormItem>
        <FormItem :label="$t('product.tenant.fastCreate.weight')" prop="weight">
          <Input v-model="form.data.weight" style="width:200px"></Input>
        </FormItem>

      </Form>
      <span
        style="color:#409fff;margin-left:80px;cursor: pointer;"
        @click="toCreate"
      >{{$t("product.tenant.fastCreate.fullCreateNotice")}}</span>
    </Card>

    <div style="margin-top:20px; padding: 0 20px;">
      <Button type="primary" :loading="btnLoading" @click="confirmAndContinue(true)">{{$t("product.tenant.fastCreate.confirmAndContinue")}}</Button>
      <Button type="primary" :loading="btnLoading" style="margin-left:8px" @click="confirmAndContinue(false)">{{$t("common.confirm")}}</Button>
      <Button type="ghost" style="margin-left:8px" @click="$router.go(-1)">{{$t("common.cancel")}}</Button>
    </div>
  </div>
</template>
<script>
import { list as brandList } from "../../../api/brand";
import { listTree as categoryList } from "../../../api/category";
import { fastAdd, list, splitPackage } from "../../../api/tenant";
import qs from "qs";
import { i18n } from "../../../setup/i18n-setup.js"
import { debounce } from "../../../utils/helper.js"

export default {
  data() {
    return {
      btnLoading: false,
      form: {
        data: {
          name: "",
          barCode: "", //商品条形码
          brandId: "", //品牌
          classId: "", //分类
          unitName: "", //单位
          weight: "", //重量
          model: "", //规格
          ptId: "", //拆单分类
          tenantId: "",//商户id
          itemNo: "" //商品货号
        },
        rules: {
          name: [{required: true, message: i18n.t("product.tenant.fastCreate.nameRequired"), trigger: "blur"}],
          itemNo: [{required: true, message: i18n.t("product.tenant.fastCreate.itemNoRequired"), trigger: "blur"}],
          barCode: [{required: true, message: i18n.t("product.tenant.fastCreate.barCodeRequired"), trigger: "blur"}],
          unitName: [{required: true, message: i18n.t("product.tenant.fastCreate.unitNameRequired"), trigger: "blur"}],
          weight: [{required: true, pattern: /^[0-9]+([.]\d{1,2})?$/, message: i18n.t("product.tenant.fastCreate.weightRequired"), trigger: "blur"}],
          model: [{required: true, message: i18n.t("product.tenant.fastCreate.modelRequired"), trigger: "blur"}],
          brandId: [{ required: true, validator: (rule, value, callback) => { value ? callback() : callback(rule.message); }, message: i18n.t("product.tenant.fastCreate.brandIdRequired"), trigger: "change"}],
          classId: [{ required: true, validator: (rule, value, callback) => { value ? callback() : callback(rule.message); }, message: i18n.t("product.tenant.fastCreate.classIdRequired"), trigger: "change" }],
          ptId: [{ required: true, message: i18n.t("product.tenant.fastCreate.ptIdRequired"), trigger: "change" }]
        }
      },
      classify: [],
      brands: [], //品牌
      categories: [], //分类
      splitPackages: [], //拆单分类数据
      splitList: [], //拆单选中后存放数据
    };
  },

  created() {
    this.fetchBrands();
    this.fetchCategories();
    this.fetchData();
    this.form.data.tenantId = this.$store.state.user.tenantId;
  },

  watch: {
    classify(val) {
      if (val && val.length) {
        this.form.data.classId = val[1];
      } else {
        this.form.data.classId = "";
      }
    },

    splitList(val) {
      if (val && val.length) {
        this.form.data.ptId = val[1];
      } else {
        this.form.data.ptId = "";
      }
    }
  },

  methods: {
    categoryChange(value) {
      this.classify = value.map(item => parseInt(item))
    },

    toCreate() {
      let sku = "";

      if (this.form.data.unitName == "" || this.form.data.model == "") {
        sku = {};
      } else {
        sku = {
          barcode: this.form.data.barCode,
          itemNo: this.form.data.itemNo,
          name: this.form.data.name,
          productUnitName: this.form.data.unitName,
          relBarcode: "",
          skuCode: this.form.data.name,
          productSkuPropertys: [],
          unit_label: this.form.data.unitName || "",
          unit_value: this.form.data.model || ""
        };
      }

      const params = {
        basic: {
          // 基础信息
          info: {
            // 商品名称
            name: this.form.data.name,
            // 品牌
            brandId: this.form.data.brandId,
            // 分类
            category: this.classify,
            // 拆弹分类
            split: this.splitList
          },
          // 计量单位
          unit: {
            height: 0,
            length: 0,
            model: this.form.data.model,
            name: this.form.data.unitName,
            rate: 1,
            weight: this.form.data.weight || 0,
            width: 0
          }
        },
        sku
      };

      this.$router.push({
        name: "product-tenant-create",
        query: {
          from: "fast-create",
          params: qs.stringify(params)
        }
      });
    },

    //获取品牌列表数据
    fetchBrands() {
      brandList().then(response => (this.brands = response.data));
    },

    // 获取拆单分类数据
    fetchData() {
      splitPackage().then(response => {
        response.result.map(item => {
          let obj = {};
          obj.value = item.sortName;
          obj.label = item.sortName;
          obj.children = [];
          item.items.map(val => {
            obj.children.push({
              value: val.ptid,
              label: val.className
            });
          });
          this.splitPackages.push(obj);
        });
      });
    },

    //获取分类数据
    fetchCategories() {
      categoryList().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.value = item.value;
          obj.label = item.label;
          obj.children = [];
          item.children.map(v => {
            obj.children.push({
              value: v.value,
              label: v.label
            });
          });
          this.categories.push(obj);
        });
      });
    },

    confirmAndContinue: debounce(function(flag = false) {
      this.sendRequest(flag)
    }, 500),

    sendRequest(flag = false) {
      this.btnLoading = true
      this.$refs["fast-create-form"].validate(valid => {
        if (valid) {
          fastAdd(this.form.data)
            .then(response => {
              this.$Message.success(i18n.t("common.success"));
              if (flag) {
                this.form.data.name = "";
                this.form.data.itemNo = "";
                this.form.data.barCode = "";
                this.form.data.unitName = "";
                this.form.data.weight = "";
                this.form.data.model = "";
                this.form.data.ptId = "";
                this.splitList = [];
                this.btnLoading = false
              } else {
                this.$router.push({ name: "product-tenant-list" });
              }
            })
            .catch(error => {
              this.btnLoading = false
              this.$Message.error(error.message);
            });
        } else {
          this.btnLoading = false
        }
      })
    },
  }
};
</script>
