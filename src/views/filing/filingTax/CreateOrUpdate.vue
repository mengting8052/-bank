<template>
  <div style="padding: 10px;">
    <Form inline :label-width="120" :model="form.data">
      <FormItem :label="$t('filingTax.gvtCode')">
        <Input type="text" style="width: 280px;" v-model="form.data.gvtCode"></Input>
      </FormItem>
      <FormItem :label="$t('filingTax.area')">
        <Cascader
          :data="nations"
          style="width: 280px;"
          v-model="area"
          change-on-select
          @on-change="areaChange"
        ></Cascader>
      </FormItem>
      <br>

      <FormItem :label="$t('filingTax.hscode')">
        <Input type="text" style="width: 280px;" v-model="form.data.hscode"></Input>
      </FormItem>
      <FormItem :label="$t('filingTax.name')">
        <Input type="text" style="width: 280px;" v-model="form.data.name"></Input>
      </FormItem>
      <br>

      <FormItem :label="$t('filingTax.tflu')">
        <Input type="text" style="width: 280px;" v-model="form.data.tflu"></Input>
      </FormItem>
      <FormItem :label="$t('filingTax.slu')">
        <Input type="text" style="width: 280px;" v-model="form.data.slu"></Input>
      </FormItem>
      <br>

      <FormItem :label="$t('filingTax.customsCondition')">
        <dic-select code="CUSTOMS_CONDITION" v-model="customsCondition"></dic-select>
      </FormItem>
      <FormItem :label="$t('filingTax.inspectionCategory')">
        <dic-select code="INSPECTION_CATEGORY" v-model="inspectionCategory"></dic-select>
      </FormItem>
      <br>

      <FormItem :label="$t('filingTax.areaTaxData')">
        <area-tax-table :data="areaTaxData"></area-tax-table>
      </FormItem>

      <FormItem :label="$t('filingTax.ccNum')">
        <rate-tax-num-select v-model="form.data.ccNum"></rate-tax-num-select>
      </FormItem>
      <br>

      <FormItem>
        <rate-tax-table :data="rateTaxData"></rate-tax-table>
      </FormItem>

      <FormItem :label="$t('filingTax.crossRate')">
        <Input type="text" style="width: 280px;" v-model="form.data.crossRate"></Input>
        <span>{{$t("filingTax.crossRateRemark")}}</span>
      </FormItem>
      <br>

      <FormItem :label="$t('filingTax.decElements')" style="width: 100%; margin-right: 20px;">
        <Input type="textarea" :autosize="{minRows: 4, maxRows: 8}" v-model="form.data.decElements"></Input>
      </FormItem>

      <FormItem>
        <Button type="ghost" @click="$router.push({name: 'filing-filingTax-list'})">{{$t('common.cancel')}}</Button>
        <Button type="primary" @click="confirm" :loading="btnLoading">{{$t('common.confirm')}}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import AreaTaxTable from "./components/AreaTaxTable";
import RateTaxTable from "./components/RateTaxTable";
import RateTaxNumSelect from "./components/RateTaxNumSelect";
import DicSelect from "./components/DicSelect";
import { list, listAreaTax } from "../../../api/tax";
import { getTaxRateByTaxNum } from "../../../api/taxRate";
import { createHscodes, fetchHscodes, updateHscodes } from "../../../api/hscodes"
import { i18n } from "../../../setup/i18n-setup.js"

const HSCODE = Object.freeze({
  // 唯一标识
  id: "",

  // GVT 编码
  gvtCode: "",

  // 国家
  nation: "",

  // 国家编码
  nationCode: "",

  // 省/州
  province: "",

  // 省/州编码
  provinceCode: "",

  // 税则编码
  hscode: "",

  // 税则名称
  name: "",

  // 第一法定单位
  tflu: "",

  // 第二法定单位
  slu: "",

  // 海关监管条件
  // 例: "条件1,条件2,条件3"
  customsCondition: "",

  // 检验检疫类别
  // 例: "类别1,类别2,类别3"
  iaqc: "",

  // HS 编码税率信息
  // 例: [{rate: "Free", taxId: 1}]
  listHscodeTax: [],

  // 个人行邮税号
  ccNum: "",

  // 跨境电商税率
  crossRate: "",

  // 申报要素
  decElements: ""
});

export default {
  components: { AreaTaxTable, RateTaxTable, RateTaxNumSelect, DicSelect },

  data() {
    return {
      id: this.$route.query.id || "",

      btnLoading: false,

      // 省市级联 Cascader 数据源
      nations: [],
      area: [],
      areaTaxData: [],

      rateTaxData: [],

      customsCondition: [],
      inspectionCategory: [],

      form: {
        data: Object.assign({}, HSCODE),
        rules: {}
      }
    };
  },

  watch: {
    "form.data.ccNum": {
      handler() {
        this.fetchRateTaxList();
      }
    },
    customsCondition(val) {
      if(val && val.length) {
        this.form.data.customsCondition = val.join(",")
      } else {
        this.form.data.customsCondition = ""
      }
    },
    inspectionCategory(val) {
      if(val && val.length) {
        this.form.data.iaqc = val.join(",")
      } else {
        this.form.data.iaqc = ""
      }
    },
  },

  created() {
    this.initNations();
    this.id && this.initHscodes()
  },

  methods: {
    initHscodes() {
      fetchHscodes(this.id).then(response => {
        this.form.data = Object.assign({}, HSCODE, response.data)
        // 初始化 area
        this.form.data.nationCode && this.area.push(this.form.data.nationCode)
        this.form.data.provinceCode && this.area.push(this.form.data.provinceCode)
        // 初始化 海关监管条件
        this.form.data.customsCondition && (this.customsCondition = this.form.data.customsCondition.split(","))
        // 初始化 检验检疫类别
        this.form.data.iaqc && (this.inspectionCategory = this.form.data.iaqc.split(","))
        // 初始化税率信息数据源
        this.fetchAreaTaxList(true)
      }).catch(error => {
        this.$Message.error(error.message)
      })
    },

    // 初始化区域级联数据源
    initNations() {
      list().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.label = item.nation;
          obj.value = item.nationCode;
          obj.type = "nation";
          obj.children = [];
          if (item.provinces && item.provinces.length) {
            obj.children = item.provinces.map(v => {
              return { label: v.province, value: v.provinceCode, type: "province" };
            });
          }
          this.nations.push(obj);
        });
      });
    },

    // 区域级联改变事件
    areaChange(value, selectedData) {
      if (selectedData.length) {
        if (selectedData.length === 1) {
          this.form.data.nation = selectedData[0]["label"];
          this.form.data.nationCode = selectedData[0]["value"];
          this.form.data.province = "";
          this.form.data.provinceCode = "";
        } else {
          this.form.data.nation = selectedData[0]["label"];
          this.form.data.nationCode = selectedData[0]["value"];
          this.form.data.province = selectedData[1]["label"];
          this.form.data.provinceCode = selectedData[1]["value"];
        }
      } else {
        this.form.data.nation = "";
        this.form.data.nationCode = "";
        this.form.data.province = "";
        this.form.data.provinceCode = "";
      }
      this.fetchAreaTaxList();
    },

    // 根据当前选中 "区域," 拉取 "税率信息"
    fetchAreaTaxList(init = false) {
      const params = {nationCode: this.form.data.nationCode, provinceCode: this.form.data.provinceCode}
      listAreaTax(params).then(response => {
        this.areaTaxData = response.data.map(item => {
          if(init) {
            this.form.data.listHscodeTax.map(v => {
              if(v.taxId == item.id) {
                item._rate = v.rate
              }
            })
          } else {
            item._rate = ""
          }
          return item;
        });
      });
    },

    // 根据当前" 个人行邮税号", 拉取 "税号详情"
    fetchRateTaxList() {
      getTaxRateByTaxNum(this.form.data.ccNum).then(response => {
        this.rateTaxData = response.data ? [response.data] : [];
      });
    },

    // "确认" 按钮点击
    confirm() {
      this.btnLoading = true

      // 初始化 form.data.listHscodeTax
      this.form.data.listHscodeTax = this.areaTaxData.map(item => {
        return {taxId: item.id, rate: item._rate}
      })

      const requestMethod = this.id ? updateHscodes : createHscodes
      
      requestMethod(this.form.data).then(response => {
        this.$Message.success(i18n.t("common.success"))
        this.$router.push({name: "filing-filingTax-list"})
        this.btnLoading = false
      }).catch(error => {
        this.$Message.error(error.message)
        this.btnLoading = false
      })
    }
  }
};
</script>