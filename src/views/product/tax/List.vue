<template>
  <gvt-layout-tree dis-title>
    <template slot="search">
      <Form inline>
        <FormItem>
          <Input v-model="form.key" :placeholder="$t('product.tax.placeholder')" clearable style="width: 300px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t("common.search")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="data-title">{{$t("product.tax.title")}}</template>

    <template slot="data-tree">
      <Tree :data="taxs" @on-select-change="treeChange"></Tree>
    </template>

    <template slot="data-table-btns">
      <Button type="primary" @click="createBtnClick">{{$t("common.create")}}</Button>
    </template>

    <template slot="data-table">
      <Table
        :loading="table.loading"
        :columns="table.cols"
        :data="table.data"
        :height="$layoutTree.tableHeight"
      ></Table>
    </template>

    <template slot="data-page">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData"
      ></gvt-page>
    </template>

    <create-or-update-modal :visible.sync="modal.visible" :nations="modal.nations" :tax-id="modal.taxId" @on-success="loadData"></create-or-update-modal>
  </gvt-layout-tree>
</template>

<script>
import { layout_tree_break } from "../../../mixins/layout-tree-break";
import { PAGE_PARAMS } from "../../../constants";
import * as PROPERY from "../../../api/tax";
import * as DETAIL from "../../../api/tax-detail";
import createOrUpdateModal from "./components/createOrUpdateModal";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_tree_break],

  components: { createOrUpdateModal },

  data() {
    return {
      modal: {
        taxId: "",
        visible: false,
        nations: []
      },

      form: {
        key: "",
        nationCode: "",
        provinceCode: ""
      },

      table: {
        loading: false,
        data: [],
        cols: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.tax.shortName"),
            key: "shortName"
          },
          {
            title: i18n.t("product.tax.name"),
            key: "name"
          },
          {
            title: i18n.t("product.tax.remark"),
            key: "remark"
          },
          {
            title: i18n.t("product.tax.status"),
            key: "status",
            render: (h, params) => {
              const status = params.row.status;
              const text = status === true ? i18n.t("product.tax.enable") : i18n.t("product.tax.disable");
              return h("span", text);
            }
          },
          {
            title: i18n.t("common.operate"),
            key: "CRUD",
            align: "center",
            render: (h, params) => {
              const statusBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.changeTaxStatus(params.index);
                    }
                  }
                },
                params.row.status === true ? i18n.t("product.tax.disable") : i18n.t("product.tax.enable")
              );

              const editBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.editBtnClick(params.row.id)
                    }
                  }
                },
               i18n.t("common.edit")
              );

              const removeBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["remove-btn"],
                  on: {
                    click: () => {
                      this.removeTaxItem(params.row.id);
                    }
                  }
                },
                i18n.t("common.remove")
              );
              return h("span", [statusBtn, editBtn, removeBtn]);
            }
          }
        ]
      },

      taxs: [
        {
          title: i18n.t("product.tax.country"),
          expand: true,
          disabled: true,
          children: []
        }
      ],

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  created() {
    this.initTreeAndCascader();
    this.loadData();
  },
  
  methods: {
    initTreeAndCascader() {
      PROPERY.list().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.title = obj.label = item.nation;
          obj.value = item.nationCode
          obj.type = "nationCode"
          obj.children = []
          if(item.provinces && item.provinces.length) {
            obj.children = item.provinces.map(v => {
              return {title: v.province, label: v.province, value: v.provinceCode, type: "provinceCode" }
            })
          }

          // 左侧 Tree 数据源
          this.taxs[0]["children"].push(obj);
          // 模态框 Cascader 数据源
          this.modal.nations.push(obj);
        });
      });
    },

    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.current = 1);
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      DETAIL.listPage(params)
        .then(response => {
          this.pagination.total = response.data.total;
          this.table.data = response.data.list;
          this.$$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    treeChange(arr) {
      // 每当左侧 Tree emit tree-change 时
      // 初始化筛选条件 nation 与 province 将其置为 ""
      this.form.nationCode = "";
      this.form.provinceCode = "";

      // 若有选中项, 依据 type 动态赋值 nation 与 province
      if (arr.length) {
        const selected = arr[0];
        this.form[selected.type] = selected.value
      }

      // 最后重新加载数据
      this.loadData(true);
    },

    changeTaxStatus(index) {
      const tax = this.table.data[index];
      const content = tax.status
        ? i18n.t("product.tax.disableNotice")
        : i18n.t("product.tax.enableNotice");

      this.$Modal.confirm({
        title: i18n.t("common.notify"),
        content,
        loading: true,
        onOk: () => {
          const params = {id: tax.id, status: !tax.status}

          PROPERY.updateStatus(params)
            .then(response => {
              this.$Message.success(i18n.t("common.success"));
              this.$Modal.remove();
              this.loadData();
            })
            .catch(error => {
              this.$Modal.remove();
              this.$Message.error(error.message);
            });
        }
      });
    },

    removeTaxItem(id) {
      this.$Modal.confirm({
        title: i18n.t("common.notify"),
        content: i18n.t("common.removeNotice"),
        loading: true,
        onOk: () => {
          PROPERY.remove(id)
            .then(response => {
              this.$Message.success(i18n.t("common.success"));
              this.loadData();
              this.$Modal.remove();
            })
            .catch(error => {
              this.$Message.error(error.message);
              this.$Modal.remove();
            });
        }
      });
    },

    createBtnClick() {
      this.modal.taxId = ""
      this.$nextTick(() => { this.modal.visible = true })
    },

    editBtnClick(id) {
      this.modal.taxId = id
      this.$nextTick(() => { this.modal.visible = true })
    }
  }
};
</script>

