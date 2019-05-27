<template>
  <Table :loading="table.loading" :data="table.data" :columns="table.columns"></Table>
</template>

<script>
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  name: "area-tax-table",

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
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("filingTax.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("filingTax.fullName"),
            key: "name"
          },
          {
            title: i18n.t("filingTax.rate"),
            render: (h, params) => {
              if(!params.row.rate) {
                return h("span", "") 
              } else {
                const rates = params.row.rate.split(",")
                const options = rates.map(item => {
                  return h("Option", {
                    props: {
                      value: item,
                      label: item
                    }
                  })
                })
                return h("Select", {
                  props: {
                    value: params.row._rate,
                  },
                  on: {
                    "on-change": val => {
                      params.row._rate = val
                      this.table.data[params.index] = params.row
                    }
                  }
                }, options)
              }
            }
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

