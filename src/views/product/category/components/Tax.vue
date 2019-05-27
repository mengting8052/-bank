<template>
  <div>
    <div style="padding-bottom:5px;">{{$t("product.category.rateInfoLocal")}}</div>
    <Table :loading="table.loading" :data="table.data" :columns="table.columns"></Table>
  </div>
</template>

<script>
import { listLocalTax } from "../../../../api/tax"
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  props: {
    tax: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      id: this.$route.query.id || "",

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
            title: i18n.t("product.category.nation"),
            key: "nation"
          },
          {
            title: i18n.t("product.category.province"),
            key: "province"
          },
          {
            title: i18n.t("product.category.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.category.fullName"),
            key: "name"
          },
          {
            title: i18n.t("product.category.rate"),
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
    tax: {
      handler() {
        this.initTax()
      }
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    initTax() {
      if(this.table.data.length && this.tax.length) {
        this.table.data = this.table.data.map(item => {
          this.tax.map(v => {
            if(v.taxId == item.id) {
              item._rate = v.rate
            }
          })
          return item
        })
      }
    },

    loadData(init = false) {
      this.table.loading = true
      listLocalTax().then(response => {
        this.table.data = response.data.map(item => {
          item._rate = ""
          return item
        })
        this.$nextTick(() => {
          this.initTax()
          this.table.loading = false
        }) 
      }).catch(() => {
        this.table.loading = false
      })
    },

    getRequestData() {
      return {
        listTax: this.table.data.map(item => ({taxId: item.id, rate: item._rate }))
      }
    }
  }
}

</script>

