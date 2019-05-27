<template>
  <div>
    <div>
      {{$t('product.basicRate.title')}}
      <Button type="text" @click="visible = !visible" style="color:#2d8cf0;padding-top:5px;">{{$t('product.basicRate.addRate')}}</Button>
    </div>

    <Table :data="table.data" :columns="table.columns"></Table>

    <rate-modal :visible.sync="visible" @on-choosed="choosed"></rate-modal>
  </div>
</template>

<script>
import RateModal from "./BasicRateModal"
import { fetchHsCodeList, fetchHsCodeListByCategoryId } from "../../../../../api/product"
import { fetchGvtHscode } from "../../../../../api/tenant"
import { i18n } from "../../../../../setup/i18n-setup.js"

export default {
  components: { RateModal },

  data() {
    return {
      id: "",

      visible: false,

      table: {
        data: [],
        columns: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("product.basicRate.nation"),
            key: "nation",
          },
          {
            title: i18n.t("product.basicRate.province"),
            key: "province"
          },
          {
            title: i18n.t("product.basicRate.gvtCode"),
            key: "gvtCode"
          },
          {
            title: i18n.t("product.basicRate.hscode"),
            key: "hscode"
          },
          {
            title: i18n.t("product.basicRate.rate"),
            key: "rate"
          },
          {
            title: i18n.t("common.operate"),
            key: "CURD",
            align: "center",
            render: (h, params) => {
              return h("Button", {
                props: {
                  type: "text"
                },
                class: ["remove-btn"],
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: i18n.t("common.notify"),
                      content: i18n.t("product.basicRate.removeNotice"),
                      onOk: () => {
                        this.table.data.splice(params.index, 1);
                      }
                    });
                  }
                }
              }, i18n.t("common.remove"))
            }
          }
        ]
      }
    }
  },

  created() {
    if(this.$route.query.id) {
      this.id = this.$route.query.id
    }

    // 兼容商品审核的 tenantProductId
    if(this.$route.query.tenantProductId) {
      this.id = this.$route.query.tenantProductId
    }
    this.id && this.initRate();
    this.$bus.on("category-change", this.categoryWatcher);
  },

  beforeDestroy() {
    this.$bus.off("category-change", this.categoryWatcher);
  },

  methods: {
    categoryWatcher(categoryId) {
      fetchHsCodeListByCategoryId(categoryId).then(response => {
        this.table.data = [];
        if (response.data.length) {
          this.choosed(response.data);
        }
      })
    },

    initRate() {
      if(this.$route.query.gvt) {
        fetchGvtHscode(this.id).then(response => {
          this.table.data = response.data || []
        })
      } else {
        fetchHsCodeList(this.id).then(response => {
          this.table.data = response.data || []
        })
      }
    },

    choosed(selection) {
      selection.map(item => {
        const found = this.table.data.find(v => item.id == v.id)
        !found && this.table.data.push(item)
      })
    },

    getData() {
      return this.table.data.map(item => item.id)
    }
  }
}
</script>

