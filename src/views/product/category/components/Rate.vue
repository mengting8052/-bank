<template>
  <div>
    <div>
      {{$t("product.category.rateInfoCross")}}
      <Button type="text" @click="visible = !visible" style="color:#2d8cf0;padding-top:5px;">{{$t("product.category.createTax")}}</Button>
    </div>

    <Table :data="table.data" :columns="table.columns"></Table>

    <rate-modal :visible.sync="visible" @on-choosed="choosed"></rate-modal>
  </div>
</template>

<script>
import RateModal from "./RateModal"
import { getSecondHscode } from "../../../../api/category"
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  components: { RateModal },

  data() {
    return {
      id: this.$route.query.id || "",

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
            title: i18n.t("product.category.nation"),
            key: "nation",
          },
          {
            title: i18n.t("product.category.province"),
            key: "province"
          },
          {
            title: i18n.t("product.category.gvtCode"),
            key: "gvtCode"
          },
          {
            title: i18n.t("product.category.hscode"),
            key: "hscode"
          },
          {
            title: i18n.t("product.category.rate"),
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
                      content: i18n.t("common.removeNotice"),
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
    this.id && this.initRate()
  },

  methods: {
    initRate() {
      getSecondHscode(this.id).then(response => {
        this.table.data = response.data || []
      })
    },

    choosed(selection) {
      selection.map(item => {
        const found = this.table.data.find(v => item.id == v.id)
        !found && this.table.data.push(item)
      })
    },

    getRequestData() {
      return {
        listHscode: this.table.data.map(item => item.id)
      }
    }
  }
}
</script>

