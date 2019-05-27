<template>
<!--#272f3b-->
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
import BasicRate from "./BasicRate"
import {
  PRODUCT_BASIC_INFO_VALIDATOR,
  PRODUCT_BASIC_UNITS_VALIDATOR,
  PRODUCT_BASIC_UNITS_ITEM_VALIDATOR,
} from "../../../../../validation";

export default {
  components: { BasicInfo, BasicAlias, BasicUnitId, BasicTax, BasicRate },

  props: {
    initBasic: [Object]
  },

  data() {
    return {
      basic: { aliases: [], taxs: [] }
    };
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
        brandName: this.basic.brandName,
        // 商品分类
        classId: this.basic.classId,
        bigClassName: this.basic.bigClassName,
        smallClassName: this.basic.smallClassName,
        // 原产地
        origin: this.basic.origin,
        // 拆单分类
        ptId: this.basic.ptId,
        // 成分含量
        componentContent: this.basic.componentContent
      };
    },
    basicAlias() {
      return this.basic.aliases.map(item => item.alias);
    },
    basicTax() {
      return this.basic.taxs.map(item => {
        return Object.assign({}, {}, item);
      });
    }
  },

  methods: {
    getData() {
      const info = this.$refs["basic-info"].getData();

      const aliasList = this.$refs["basic-alias"].getData();

      const unitList = this.$refs["basic-unit-id"].getUnitData();

      const taxList = this.$refs["basic-tax"].getData();

      const hscodeList = this.$refs["basic-rate"].getData();

      return Object.assign({}, info, { aliasList, unitList, taxList, hscodeList });
    },

    next() {
      let pass = false;

      const info = this.$refs["basic-info"].getData();
      PRODUCT_BASIC_INFO_VALIDATOR.validate(info, (errors, fields) => {
        if (errors) {
          this.$Message.error(errors[0]["message"]);
        } else {
          pass = true;
        }
      });

      const units = this.$refs["basic-unit-id"].getUnitData();
      if (pass) {
        units.some(item => {
          let stop = false;
          PRODUCT_BASIC_UNITS_ITEM_VALIDATOR.validate(
            item,
            (errors, fields) => {
              if (errors) {
                this.$Message.error(errors[0]["message"]);
                stop = true;
                pass = false;
              } else {
                pass = true;
              }
            }
          );
          return stop;
        });
      }

      if (pass) {
        PRODUCT_BASIC_UNITS_VALIDATOR.validate({ units }, (errors, fields) => {
          if (errors) {
            this.$Message.error(errors[0]["message"]);
            pass = false;
          } else {
            pass = true;
          }
        });
      }

      if (pass) {
        this.$emit("next", "sku");
      }
    }
  }
};
</script>

