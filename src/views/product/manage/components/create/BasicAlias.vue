<template>
  <div>
    <h2>{{$t("product.basicAlias.title")}}</h2>
    <br>

    <Input type="text" style="width: 200px" v-model.trim="name" @on-enter="addAlias">
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
export default {
  name: "basic-alias",

  data() {
    return {
      name: "",
      alias: []
    };
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
      // 别名校验
      if (this.name.length === 0) {
        return;
      }
      if (this.name.length > 500) {
        this.$Message.error(this.$t("product.basicAlias.error"));
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
