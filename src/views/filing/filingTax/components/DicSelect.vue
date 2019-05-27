<template>
  <Select v-model="selected" multiple @on-change="change" style="width: 280px;" filterable>
    <Option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">{{ item.value + " " +item.name }}</Option>
  </Select>
</template>

<script>
// 海关监管条件 ： CUSTOMS_CONDITION
// 检验检疫类别 ： INSPECTION_CATEGORY
const CODES = ["CUSTOMS_CONDITION", "INSPECTION_CATEGORY"]

import { listDictionaryByCode } from "../../../../api/dictionary"

export default {
  name: "dic-select",

  props: {
    code: {
      type: String,
      required: true,
      validator(val) {
        return CODES.indexOf(val) > -1
      }
    },

    value: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      selected: [],
      options: []
    }
  },

  watch: {
    value() {
      this.updateSelected()
    }
  },

  created() {
    this.updateSelected()
    this.fetchData()
  },

  methods: {
    updateSelected() {
      this.selected = this.value.map(item => item)
    },

    fetchData() {
      listDictionaryByCode(this.code).then(response => {
        this.options = response.data
      })
    },

    change(selecteds) {
      this.$emit("input", selecteds)
    }
  }
}
</script>
