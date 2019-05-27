<template>
  <div v-if="properties.length">
    <h2>{{$t("product.skuProperty.title")}}</h2>
    <br>
    <sku-property-item v-for="item in properties" :key="item.id" :property="item" @change="change" :init-property="checkedProperties.filter(p => {return p.id == item.id})"></sku-property-item>
  </div>
</template>

<script>
import SkuPropertyItem from "./SkuPropertyItem";
import {
  listPropertyByClass,
  listPropertyByClassName
} from "../../../../../api/property";
import {
  findComponentUpward,
  findComponentDownward
} from "../../../../../utils/helper";

export default {
  components: { SkuPropertyItem },

  props: {
    initProperties: [Array]
  },

  data() {
    return {
      properties: [],
      selected_properties: [],
      checkedProperties: []
    };
  },

  watch: {
    initProperties(val) {
      this.checkedProperties = val;
    }
  },

  created() {
    this.$bus.on("category-change-property", this.categoryWatcher);
  },

  beforeDestroy() {
    this.$bus.off("category-change-property", this.categoryWatcher);
  },

  methods: {
    getData() {
      const data = [];
      this.selected_properties.map(item => {
        const arr = [];
        item.map(v => {
          arr.push({
            id: v.id,
            name: v.name,
            property_id: v.property_id,
            property_name: v.property_name,
            _mark: "property"
          });
        });
        data.push(arr);
      });
      return data;
    },

    change(details) {
      let arr = [];
      this.$children.map(item => {
        const details = item.details.map(v =>
          Object.assign(
            {},
            { id: v.id, name: v.name, property_id: v.property_id, property_name: v.property_name }
          )
        );
        if (item.details.length) {
          arr.push(details);
        }
      });

      this.selected_properties = arr;
    },

    categoryWatcher(categoryId) {
      if (categoryId === "none") {
        // 从 basic-info 组件中拿到 一级/二级 分类的名称
        const parent = findComponentUpward(this, "product-manage-edit");
        const params = {
          bigName: parent.initBasic.bigClassName,
          smallName: parent.initBasic.smallClassName
        };
        listPropertyByClassName(params).then(response => {
          this.properties = response.data || [];
        });
      } else {
        listPropertyByClass({ categoryId }).then(response => {
          this.properties = response.data;
        });
      }
    }
  }
};
</script>

