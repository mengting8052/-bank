<template>
  <div>
    <div class="search-wrapper">

      <basic-info ref="basic-info" :basic-info="basicInfo"></basic-info>
      <basic-alias ref="basic-alias" :basic-alias="basicAlias"></basic-alias>
      <basic-unit-id ref="basic-unit-id"></basic-unit-id>
      <basic-tax ref="basic-tax" :basic-tax="basicTax"></basic-tax>
      <basic-rate ref="basic-rate"></basic-rate>

      <br>
      <div>
        <Button type="primary" @click="next">{{$t("product.tabs.next")}}</Button>
        <Button type="ghost" @click="$router.go(-1)">{{$t("common.cancel")}}</Button>
      </div>
      
    </div>
  </div>
</template>

<script>
import BasicInfo from "./BasicInfo";
import BasicAlias from "./BasicAlias";
import BasicUnitId from "./BasicUnitId";
import BasicTax from "./BasicTax";
import BasicRate from "./BasicRate";

export default {
  components: { BasicInfo, BasicAlias, BasicUnitId, BasicTax, BasicRate },

  props: {
    initBasic: [Object]
  },

  data() {
    return {
      basic: {
        alias: [], 
        tenantProductUnitAuditVOList: [],
        tenantProductTaxAuditVOList: []
      },
    }
  },

  watch: {
    initBasic(val) {
      this.basic = Object.assign({}, this.basic, val);
    }
  },

  computed: {
    basicInfo() {
      return {
        image: this.basic.image,
        // 商品名称
        name: this.basic.name,
        // 商品简称
        shortName: this.basic.shortName,
        // 商品品牌
        brandId: this.basic.brandId,
        // 商品分类
        classId: this.basic.classId,
        // 原产地
        origin: this.basic.origin,
        // 拆单分类
        ptId: this.basic.ptId,
        // 成分含量
        componentContent: this.basic.componentContent,
        // 品牌名称
        brandName: this.basic.brandName,
        // 一级分类名称
        bigClassName: this.basic.bigClassName,
        // 二级分类名称
        smallClassName: this.basic.smallClassName
      };
    },
    basicAlias() {
      return this.basic.alias.map(item => item);
    },
    basicTax() {
      return this.basic.tenantProductTaxAuditVOList.map(item => {
        return Object.assign({}, {taxId: item.taxId, rate: item.rate || ""});
      });
    }
  },

  methods: {
    getData() {
      const info = this.$refs["basic-info"].getData();

      const alias = this.$refs["basic-alias"].getData();

      const productUnitAuditDTOList = this.$refs["basic-unit-id"].getUnitData();

      const taxList = this.$refs["basic-tax"].getData();

      const hscodeList = this.$refs["basic-rate"].getData();

      return Object.assign({}, info, { alias, productUnitAuditDTOList, taxList, hscodeList });
    },

    next() {
      this.$emit("next", "sku");
    }
  }
};
</script>

