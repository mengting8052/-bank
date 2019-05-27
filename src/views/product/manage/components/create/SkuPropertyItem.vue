<template>
  <div style="margin-bottom: 10px;">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
      <h2>
        {{ property.name }}
        <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">{{$t("product.skuPropertyItem.checkAll")}}</Checkbox>
        <Button type="text" @click="visible = !visible" style="color:#2d8cf0">
          {{$t("product.skuPropertyItem.add", {name: property.name})}}
        </Button>
      </h2>
    </div>
    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
      <Checkbox v-for="item in property.detailsList" :key="item.id" :label="item.id">{{ item.name }}</Checkbox>
    </CheckboxGroup>

    <property-detail-add-modal :visible.sync="visible" :property-id="property.id" :property-name="property.name"  :showStatus="false" @success="addPropertyDetail"></property-detail-add-modal>
  </div>
</template>

<script>
import PropertyDetailAddModal from "../../../attribute/components/PropertyDetailAddModal"
export default {
  name: "sku-property-item",

  components: { PropertyDetailAddModal },

  props: {
    property: [Object]
  },

  data() {
    return {
      visible: false,
      checkAll: false,
      checkAllGroup: [],
      selected_property: {},
      details: []
    };
  },

  watch: {
    checkAllGroup(val) {
      this.details.length = 0;
      this.property.detailsList.map(item => {
        if (val.indexOf(item.id) > -1) {
          this.details.push({
            id: item.id,
            name: item.name,
            property_id: this.property.id,
            property_name: this.property.name
          });
        }
      });
      if (this.details.length) {
        this.selected_property = Object.assign(
          {},
          { id: this.property.id, name: this.property.name }
        );
      } else {
        this.selected_property = {};
      }
      this.$emit("change", this.details);
    }
  },

  methods: {
    addPropertyDetail(detail) {
      this.property.detailsList.push(detail);
    },

    handleCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.checkAllGroup = this.property.detailsList.map(item => item.id);
      } else {
        this.checkAllGroup = [];
      }
    },

    checkAllGroupChange(data) {
      const length = this.property.detailsList.length;
      if (data.length === length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  }
};
</script>
