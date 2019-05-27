<template>
  <div v-if="properties.length">
    <h2>{{$t('product.skuProperty.title')}}</h2>
    <br>
    <sku-property-item v-for="item in properties" :key="item.id" :property="item" @change="change"></sku-property-item>
  </div>
</template>

<script>
import SkuPropertyItem from "./SkuPropertyItem";
import { listPropertyByClass } from "../../../../api/property";

export default {
  components: { SkuPropertyItem },

  data() {
    return {
      properties: [],
      selected_properties: []
    };
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
      listPropertyByClass({ categoryId }).then(response => {
        this.properties = response.data;
      });
    }
  }
};
</script>

