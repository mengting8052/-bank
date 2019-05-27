<template>
  <Table :loading="table.loading" :data="table.data" :columns="table.columns"></Table>
</template>

<script>
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  name: "rate-tax-table",

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      table: {
        loading: false,
        data: [],
        columns: [
          {
            title: i18n.t("filingTax.taxNum"),
            key: "taxNum"
          },
          {
            title: i18n.t("filingTax.productName"),
            key: "productName"
          },
          {
            title: i18n.t("filingTax.unit"),
            key: "unit"
          },
          {
            title: i18n.t("filingTax.price"),
            key: "price"
          },
          {
            title: i18n.t("filingTax.rate"),
            key: "rate"
          }
        ]
      }
    }
  },

  watch: {
    data() {
      this.table.loading = true
      this.updateTableData()
    }
  },

  created() {
    this.updateTableData()
  },

  methods: {
    updateTableData() {
      this.table.data = this.data
      this.$nextTick(() => {
        this.table.loading = false
      })
    }
  }
}
</script>