<template>
  <div>
    <br>
    <h2>{{$t('product.basicTax.title')}}</h2>
    <br>

    <div style="padding-bottom:5px;">{{$t('product.basicTax.localTitle')}}</div>
    <Table :loading="table.loading" :data="table.data" :columns="table.columns"></Table>
  </div>
</template>

<script>
import { listLocalTax } from "../../../../../api/tax"
import { fetchTaxListByCategoryId } from "../../../../../api/product"
import { i18n } from "../../../../../setup/i18n-setup.js"

export default {
  props: {
    basicTax: {
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
            title: i18n.t("product.basicTax.nation"),
            key: "nation"
          },
          {
            title: i18n.t("product.basicTax.province"),
            key: "province"
          },
          {
            title: i18n.t("product.basicTax.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.basicTax.name"),
            key: "name"
          },
          {
            title: i18n.t("product.basicTax.rate"),
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
    basicTax: {
      immediate: true,
      handler() {
        this.initTax()
      }
    }
  },

  created() {
    this.loadData()
    this.$bus.on("category-change", this.categoryWatcher);
  },

  beforeDestroy() {
    this.$bus.off("category-change", this.categoryWatcher);
  },

  methods: {
    categoryWatcher(categoryId) {
      fetchTaxListByCategoryId(categoryId).then(response => {
        this.table.data = this.table.data.map(item => {
          item._rate = ""
          response.data.map(v => {
            if(v.taxId == item.id) {
              item._rate = v.rate
            }
          })
          return item
        })
      })
    },

    initTax() {
      if(this.table.data.length && this.basicTax.length) {
        this.table.data = this.table.data.map(item => {
          this.basicTax.map(v => {
            if(v.taxId == item.id) {
              item._rate = v.rate
            }
          })
          return item
        })
      }
    },

    loadData() {
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

    getData() {
      return this.table.data.map(item => ({taxId: item.id, rate: item._rate }))
    }
  }
}

</script>


