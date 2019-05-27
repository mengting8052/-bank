<template>
  <div>
    <h2>{{$t("product.basicAlias.title")}}</h2>
    <br>

    <Input type="text" style="width: 200px" v-model="name" @on-enter="addAlias">
      <span slot="append">
        <Button type="primary" @click="addAlias">{{$t("common.confirm")}}</Button>
      </span> 
    </Input>
    <br>

    <Tag 
      type="border" 
      closable 
      color="blue" 
      v-for="(item, index) in alias" 
      :key="item.value"
      :name="index"
      @on-close="close">
      {{item.label}}
    </Tag>

  </div>
</template>

<script>
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  name: "basic-alias",

  props: {
    basicAlias: [Array]
  },

  data() {
    return {
      name: "",
      alias: []
    };
  },

  watch: {
    basicAlias(val) {
      this.alias = val.map((item, index) => ({
        value: index,
        label: item
      }))
    },    
  },

  computed: {
    aliasList() {
      return this.alias.map(item => item.label);
    }
  },

  methods: {
    getData() {
      return this.aliasList;
    },

    close(event, name) {
      this.alias.splice(name, 1);
    },

    addAlias() {
      if (this.name.length === 0) {
        return;
      }
      if (this.name.length > 30) {
        this.$Message.error(i18n.t("product.error"));
        return;
      }
      if(this.alias.find(item => item.label == this.name)) {
        return;
      }
      const length = this.alias.length;
      const obj = Object.assign({}, { value: length - 1, label: this.name });
      this.alias.push(obj);
      this.name = "";
    }
  }
};
</script>
