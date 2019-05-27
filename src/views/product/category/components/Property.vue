<template>
  <div>
    <div>
      {{$t("product.category.relationPP")}}
      <Button type="text" @click="visible = !visible" style="color:#2d8cf0;padding-top:5px;">{{$t("product.category.choosePP")}}</Button>
    </div>

    <div class="list" style="margin-top: 10px;">
      <Tag type="dot" v-for="(item, index) in property" :key="item.id + '.' + index" :name="index" @on-close="close" closable color="blue">{{ item.name }}</Tag> 
    </div>

    <property-modal :visible.sync="visible" @selection-choosed="choosed"></property-modal>
  </div>
</template>

<script>
import PropertyModal from "./PropertyModal";
import { getSecondProperty } from "../../../../api/category";

export default {
  components: { PropertyModal },

  data() {
    return {
      visible: false,
      id: this.$route.query.id || "",
      property: []
    };
  },

  created() {
    this.id && this.initProperty()
  },

  methods: {
    initProperty() {
      getSecondProperty(this.id).then(response => {
        this.property = response.data.map(item => {
            return { 
              id: item.propertyId, 
              name: item.name, 
              propertyDetailId: item.propertyId 
            };
        });
      });
    },

    choosed(selection) {
      selection.map(item => {
        const obj = {id: item.id, name: item.name};
        const found = this.property.find(item => item.id == obj.id);
        if(!found) this.property.push(obj);
      });
    },

    close(event, name){
      this.property.splice(name, 1);
    },

    getRequestData(){
      return {
        listProperty: this.property.map(item => ({propertyId: item.id}))
      }
    }
  }
};
</script>
