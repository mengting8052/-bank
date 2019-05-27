<template>
  <Modal v-model="show" :title="$t('product.skuBarCode.title')" :mask-closable="false" :closable="false">
    <Table :loading="table.loading" :data="table.data" :columns="table.columns"></Table>
    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirm" :disabled="readOnly">{{$t("common.confirm")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { PRODUCT_SKU_BARCODE_VALIDATOR } from "../../../../../validation";
import { i18n } from "../../../../../setup/i18n-setup.js";

export default {
  props: {
    readOnly: Boolean,
    visible: {
      type: Boolean,
      default: false
    },
    relBarcode: {
      type: [String]
    }
  },

  data() {
    return {
      show: this.visible,
      table: {
        loading: false,
        data: [],
        columns: [
          { type: "index", width: 60, align: "center" },
          {
            title: i18n.t("common.operate"),
            align: "center",
            render: (h, params) => {
              const editBtn = h(
                "Button",
                {
                  props: {
                    type: "text",
                    disabled: this.readOnly
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.table.data.push({
                        barcode: ""
                      });
                    }
                  }
                },
                i18n.t("product.skuBarCode.add")
              );

              const removeBtn = h(
                "Button",
                {
                  props: {
                    type: "text",
                    disabled: this.readOnly
                  },
                  class: ["remove-btn"],
                  on: {
                    click: () => {
                      const index = params.index;
                      const length = this.table.data.length;
                      if (length === 1) {
                        params.row.barcode = "";
                        this.table.data[index] = params.row;
                      } else {
                        this.table.data.splice(index, 1);
                      }
                    }
                  }
                },
                i18n.t("common.remove")
              );

              return h("div", [editBtn, removeBtn]);
            }
          },
          {
            title: i18n.t("product.skuBarCode.addSkuBarCode"),
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.barcode,
                  readonly: this.readOnly
                },
                on: {
                  "on-enter": () => {
                    this.table.data.push({
                      barcode: ""
                    });
                  },
                  input: val => {
                    params.row.barcode = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          }
        ]
      }
    };
  },

  watch: {
    visible(val) {
      this.show = val;
      if (val) {
        let relBarcode = this.relBarcode;
        if (relBarcode.length > 0) {
          let arr = relBarcode.split(",");
          this.table.data = arr.map(item => {
            return { barcode: item };
          });
        } else {
          this.table.data = [{ barcode: "" }];
        }
      }
    },
    show(val) {
      this.$emit("update:visible", val);
    }
  },

  methods: {
    confirm() {
      // 当前多条码数组
      let arrs = []
      // 当前多条码字符串, 按 "," 分隔
      let relBarcode = ""

      // 初始化 arrs & relBarcode
      this.table.data.map(item =>  {
        if(item.barcode) {
          arrs.push(item.barcode);
          relBarcode += `${item.barcode},`;
        } 
      })

      // 判断自身是否重复
      PRODUCT_SKU_BARCODE_VALIDATOR.validate({ barcodes: arrs }, (errors, fields) => {
        if(errors) {
          this.$Message.error(i18n.t("product.skuBarCode.repeatBarCodeWithSelf"))
        } else {
          // 父组件中的 "商品条码" 集合
          let parentBarcodes = []
          // 除自身以外的 "多条码" 集合
          let relBarcodes = []
          // 父组件 data 中的 "索引下标"
          let parent_item_index = this.$parent.index

          // 初始化 parentBarcodes & relBarcodes
          this.$parent.data.map((item, index) => {
            if (item.barcode) parentBarcodes.push(item.barcode);
            // 排除自身
            if(index !== parent_item_index) {
              if (item.relBarcode) {
                relBarcodes.push(...item.relBarcode.split(","))
              }
            }
          })
          
          // 校验当前 "多条码" 是否与 "商品条形码" 重复
          function repeatBarCodeWithProduct(el, index, array) {
            return parentBarcodes.includes(el)
          }
          const isRepeated = arrs.some(repeatBarCodeWithProduct)

          if(isRepeated) {
            this.$Message.error(i18n.t("product.skuBarCode.repeatBarCodeWithProduct"))
          } else {
              // 校验当前 "多条码" 是否与 其他 "多条码" 重复
              PRODUCT_SKU_BARCODE_VALIDATOR.validate({ barcodes: [...arrs, ...relBarcodes] }, (errors, fields) => {
                if(errors) {
                  this.$Message.error(i18n.t("product.skuBarCode.repeatBarCodeWithOthers"))
                } else {
                  this.$emit("add-rel-barcode", relBarcode.slice(0, relBarcode.lastIndexOf(",")));
                  this.show = false;
                }
              })
          }
        }
      })


    },
  }
};
</script>

