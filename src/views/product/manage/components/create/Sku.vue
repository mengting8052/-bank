<template>
  <div>
    <sku-property ref="sku-property"></sku-property>

    <br>
    <h2>
      {{$t("product.sku.title")}}
      <Button
        type="text"
        @click="generate_sku_table"
        style="color:#2d8cf0"
      >{{$t("product.sku.confirmCreateSku")}}</Button>
    </h2>
    <br>

    <sku-table :columns="columns" :data="data"></sku-table>

    <sku-bar-code
      :visible.sync="visible"
      :rel-barcode="$relBarcode"
      @add-rel-barcode="addRelBarcode"
    ></sku-bar-code>

    <sku-img :visible.sync="visibleImg" :sku-image="$skuImage" @add-sku-image="addSkuImage"></sku-img>

    <br>
    <div>
      <Button type="primary" @click="pre">{{$t('product.tabs.pre')}}</Button>
      <Button type="primary" @click="next">{{$t('product.tabs.next')}}</Button>
      <Button type="primary" @click="confirm" :loading="btnLoading">{{$t('common.confirm')}}</Button>
      <Button type="ghost" @click="$router.go(-1)">{{$t('common.cancel')}}</Button>
    </div>
  </div>
</template>

<script>
import SkuProperty from "./SkuProperty";
import SkuTable from "./SkuTable";
import SkuBarCode from "./SkuBarCode";
import SkuImg from "./SkuImg";
import createSkuPropertyId from "../../utils";
import { mapGetters } from "vuex";
import {
  findComponentUpward,
  findComponentDownward,
  findComponentsDownward,
  descartes
} from "../../../../../utils/helper";
import {
  PRODUCT_SKUS_ITEM_VALIDATOR,
  PRODUCT_SKUS_BARCODE_VALIDATOR
} from "../../../../../validation";
import { i18n } from "../../../../../setup/i18n-setup.js";

export default {
  components: { SkuProperty, SkuTable, SkuBarCode, SkuImg },

  props: {
    btnLoading: Boolean,
    initSku: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      columns: [],
      data: [],
      visible: false,
      visibleImg: false,
      index: -1
    };
  },

  computed: {
    ...mapGetters(["user"]),

    $relBarcode() {
      if (this.index > -1 && this.data[this.index].relBarcode) {
        return this.data[this.index].relBarcode;
      } else {
        return "";
      }
    },

    $skuImage() {
      if (this.index > -1 && this.data[this.index].skuImage) {
        return this.data[this.index].skuImage;
      } else {
        return "";
      }
    }
  },

  mounted() {
    const flag = JSON.stringify(this.initSku) !== "{}";
    if (flag) {
      this._table_cols();
      this.data.push(this.initSku);
    }
  },

  methods: {
    getData() {
      return this.data.map(item => {
        return Object.assign(
          {},
          {
            barcode: item.barcode,
            itemNo: item.itemNo,
            productUnitName: item.productUnitName,
            skuCode: item.skuCode,
            relBarcode: item.relBarcode,
            skuImage: item.skuImage,
            minSalesPrice: item.minSalesPrice,
            productSkuPropertys: item.productSkuPropertys
              ? item.productSkuPropertys.map(v => Object.assign({}, v))
              : []
          }
        );
      });
    },

    addRelBarcode(relBarcode) {
      this.data[this.index]["relBarcode"] = relBarcode;
    },

    addSkuImage(skuImage) {
      this.data[this.index]["skuImage"] = skuImage;
    },

    generate_sku_table() {
      this._table_cols();
      this._table_data();
    },

    _table_cols() {
      let cols_default_1 = [
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: i18n.t("product.sku.name"),
          key: "name"
        },
        {
          title: i18n.t("product.sku.itemNo"),
          key: "itemNo",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.itemNo
              },
              on: {
                input: val => {
                  params.row.itemNo = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.barcode"),
          key: "barcode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.barcode
              },
              on: {
                input: val => {
                  params.row.barcode = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.unit_value"),
          key: "unit_value"
        },
        {
          title: i18n.t("product.sku.unit_label"),
          key: "unit_label"
        }
      ];

      // 根据当前选中属性动态生成
      const childrens = findComponentsDownward(this, "sku-property-item");
      let cols_async = [];
      childrens.map(child => {
        if (child.selected_property.name) {
          cols_async.push({
            title: `${child.selected_property.name}`,
            key: `property_${child.selected_property.id}`
          });
        }
      });

      let cols_default_2 = [
        {
          title: i18n.t("product.sku.skuCode"),
          key: "skuCode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.skuCode
              },
              on: {
                input: val => {
                  params.row.skuCode = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.relationBarCode"),
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text"
                },
                class: ["edit-btn"],
                on: {
                  click: () => {
                    this.index = params.index;
                    this.visible = true;
                  }
                }
              },
              i18n.t("product.sku.add")
            );
          }
        },
        {
          title: i18n.t("product.sku.image"),
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text"
                },
                class: ["edit-btn"],
                on: {
                  click: () => {
                    this.index = params.index;
                    this.visibleImg = true;
                  }
                }
              },
              i18n.t("product.sku.search")
            );
          }
        }
      ];

      if (this.user.isTenant) {
        cols_default_2.splice(1, 0, {
          title: i18n.t("product.sku.minSalesPrice"),
          key: "minSalesPrice",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.minSalesPrice
              },
              on: {
                input: val => {
                  params.row.minSalesPrice = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        });
      }

      this.columns = cols_default_1.concat(cols_async, cols_default_2);
    },

    _table_data() {
      // 商品名称
      const info = this.get_basic_info();
      const name = info.name;
      // 商品计量单位
      const units = this.get_basic_units();
      // 商品属性
      const properties = this.get_sku_property();
      // 融和 商品属性 & 商品计量单位
      let arr = properties;
      arr.push(units);
      // 计量单位 & 商品属性 笛卡尔积
      let skus = descartes(arr);

      let data = [];

      skus.map(item => {
        let obj = {
          // 商品名称
          name: name,
          // 商品货号
          itemNo: "",
          // 商品条形码
          barcode: "",
          // 商品多条形码
          relBarcode: "",
          // 商品图片
          // "http://47.75.105.17:22124/group1/M00/00/F9/wKi5SlvjjcSACxjEAAAo9PZMWdc96.jpeg,http://47.75.105.17:22124/group1/M00/00/F9/wKi5SlvjjcyAIeAEAAAobj-4sEA86.jpeg,http://47.75.105.17:22124/group1/M00/00/F9/wKi5SlvjjdCAGbVgAAAiWVZAp8Q65.jpeg,http://47.75.105.17:22124/group1/M00/00/F9/wKi5SlvjjdWAHCOgAABJngy4_xA81.jpeg,http://47.75.105.17:22124/group1/M00/00/F9/wKi5SlvjjdqAcZsCAAAJA4tCuoo97.jpeg"
          skuImage: "",
          // 单位名称
          unit_label: "",
          // 规格
          unit_value: "",
          // 需要动态操作的属性, 如: property_${property_id}
          // property_1: "",
          // property_2: "",
          // SKU 编码
          skuCode: "",
          minSalesPrice: 0,
          productSkuPropertys: []
        };
        let skuCode = `${name}_`;
        item.map(v => {
          if (v._mark === "unit") {
            obj.unit_label = v.unit_label;
            obj.unit_value = v.unit_value;
            obj.productUnitName = v.unit_label;
          }
          if (v._mark === "property") {
            obj[`property_${v.property_id}`] = v.name;
            skuCode += `${v.name}_`;
            obj.productSkuPropertys.push({
              propertyDetailId: v.id,
              propertyDetailName: v.name,
              propertyId: v.property_id,
              propertyName: v.property_name
            });
          }
        });
        obj.skuCode = skuCode.slice(0, skuCode.lastIndexOf("_"));

        obj["__unique__"] = createSkuPropertyId(obj);
        obj["__found__"] = this.data.find(
          item => item["__unique__"] === obj["__unique__"]
        )
          ? true
          : false;

        data.push(obj);
      });

      if (this.data.length) {
        const uniqueData = [];
        const notUniqueData = data.filter(item => item["__found__"] === false);

        data.map(item => {
          if (item["__found__"]) {
            const found = this.data.find(
              v => v["__unique__"] === item["__unique__"]
            );
            uniqueData.push(
              Object.assign({}, found, {
                name: item.name,
                skuCode: item.skuCode
              })
            );
          }
        });

        const skuData = Array.from(new Set([...uniqueData, ...notUniqueData]));

        this.data = skuData;
      } else {
        this.data = data;
      }
    },

    get_sku_property() {
      return this.$refs["sku-property"].getData();
    },

    get_basic_info() {
      const parent = findComponentUpward(this, "product-manage-create");
      const child = findComponentDownward(parent, "basic-info");
      return child.getData();
    },

    get_basic_units() {
      const parent = findComponentUpward(this, "product-manage-create");
      const child = findComponentDownward(parent, "basic-unit-id");
      return child.getData();
    },

    pre() {
      this.$emit("pre", "basic");
    },

    next() {
      let pass = false;

      if (this.data.length) {
        this.data.some(item => {
          let stop = false;
          PRODUCT_SKUS_ITEM_VALIDATOR.validate(item, (errors, fields) => {
            if (errors) {
              this.$Message.error(errors[0]["message"]);
              pass = false;
              stop = true;
            } else {
              pass = true;
            }
          });
          return stop;
        });
      } else {
        this.$Message.error(i18n.t("product.sku.errorSku"));
        pass = false;
      }

      if(pass) {
        this.data.some(item => {
          let stop = false;
          PRODUCT_SKUS_BARCODE_VALIDATOR.validate(item, (errors, fields) => {
            if (errors) {
              this.$Message.error(errors[0]["message"]);
              pass = false;
              stop = true;
            } else {
              pass = true;
            }
          });
          return stop;
        });
      }

      if (pass) {
        this.$emit("next", "detail");
      }
    },

    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>

