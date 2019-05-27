<template>
<!--#272f3b-->
  <div>
    <div class="search-wrapper">

      <basic-info ref="basic-info" :basic-info="initBasic.info"></basic-info>
      <basic-alias ref="basic-alias"></basic-alias>
      <basic-unit-id ref="basic-unit-id" :basic-unit="initBasic.unit"></basic-unit-id>
      <basic-tax ref="basic-tax" :basic-tax="initBasic.tax"></basic-tax>
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
import BasicTax from "../edit/BasicTax";
import BasicRate from "../edit/BasicRate";
import {
  PRODUCT_BASIC_INFO_VALIDATOR,
  PRODUCT_BASIC_UNITS_VALIDATOR,
  PRODUCT_BASIC_UNITS_ITEM_VALIDATOR,
} from "../../../../../validation";

export default {
  components: { BasicInfo, BasicAlias, BasicUnitId, BasicTax, BasicRate },

  props: {
    initBasic: {
      type: Object,
      default: () => ({ info: {}, unit: {}, tax: [] })
    }
  },

  methods: {
    getData() {
      const info = this.$refs["basic-info"].getData();

      const aliasList = this.$refs["basic-alias"].getData();

      const unitList = this.$refs["basic-unit-id"].getUnitData();

      const taxList = this.$refs["basic-tax"].getData();

      const hscodeList = this.$refs["basic-rate"].getData()

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

