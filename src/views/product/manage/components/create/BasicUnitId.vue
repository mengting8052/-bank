<template>
  <div>
    <br>
    <h2>
      {{$t('product.basicUnitId.title')}}
      <Button type="text" @click="add" style="color:#2d8cf0">{{$t('product.basicUnitId.addUnit')}}</Button>
    </h2>
    <br>

    <Table :data="table.data" :columns="table.cols"></Table>
  </div>
</template>

<script>
import { i18n } from "../../../../../setup/i18n-setup.js"

export default {
  name: "basic-unit-id",

  props: {
    basicUnit: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      table: {
        data: [],
        cols: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            title: i18n.t("product.basicUnitId.remark"),
            key: "remark",
            render: (h, params) => {
              let text = i18n.t("product.basicUnitId.basicRemark");
              if (params.index > 0) {
                text = i18n.t("product.basicUnitId.helpRemark") + " " + params.index;
              }
              return h("span", text);
            }
          },
          {
            title: i18n.t("product.basicUnitId.name"),
            key: "name",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.name,
                  maxlength: 20
                },
                on: {
                  input: val => {
                    params.row.name = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("product.basicUnitId.rate"),
            key: "rate",
            render: (h, params) => {
              const editInput = h("Input", {
                props: {
                  type: "text",
                  value: params.row.rate
                },
                on: {
                  input: val => {
                    params.row.rate = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
              return params.index > 0 ? editInput : h("span", params.row.rate);
            }
          },
          {
            title: i18n.t("product.basicUnitId.model"),
            key: "model",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.model,
                  maxlength: 30
                },
                on: {
                  input: val => {
                    params.row.model = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("product.basicUnitId.weight"),
            key: "weight",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.weight
                },
                on: {
                  input: val => {
                    params.row.weight = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("product.basicUnitId.length"),
            key: "length",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.length
                },
                on: {
                  input: val => {
                    params.row.length = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("product.basicUnitId.width"),
            key: "width",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.width
                },
                on: {
                  input: val => {
                    params.row.width = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("product.basicUnitId.height"),
            key: "height",
            render: (h, params) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.height
                },
                on: {
                  input: val => {
                    params.row.height = val;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: i18n.t("common.operate"),
            align: "center",
            key: "CURD",
            render: (h, params) => {
              const removeBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["remove-btn"],
                  on: {
                    click: () => {
                      this.table.data.splice(params.index, 1);
                    }
                  }
                },
                i18n.t("common.remove")
              );

              if (params.index) return removeBtn;
            }
          }
        ]
      }
    };
  },

  created() {
    const flag = JSON.stringify(this.basicUnit) === "{}";
    if(!flag) {
      this.table.data.push(Object.assign({}, this.basicUnit));
    }else {
      this.table.data.push(
        {
          name: "",
          rate: 1,
          model: "",
          weight: "",
          length: "",
          width: "",
          height: ""
        }
      )
    }
  },

  methods: {
    getUnitData() {
      return this.table.data.map((item, index) => {
        return Object.assign(
          {},
          {
            isBaseUnit: index === 0 ? 1 : 0,
            height: item.height,
            length: item.length,
            model: item.model,
            name: item.name,
            rate: item.rate,
            weight: item.weight,
            width: item.width
          }
        );
      });
    },

    getData() {
      let data = [];
      this.table.data.map(item => {
        data.push({
          // 单位名称
          unit_label: item.name,
          // 规格
          unit_value: item.model,
          // KEY 标识
          _mark: "unit"
        });
      });
      return data;
    },

    add() {
      const obj = {
        name: "",
        rate: "",
        model: "",
        weight: "",
        length: "",
        width: "",
        height: ""
      };
      this.table.data.push(obj);
    }
  }
};
</script>
