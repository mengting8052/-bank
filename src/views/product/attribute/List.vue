<template>
  <gvt-layout-tree>
    <template slot='title'>{{$t("product.attribute.titleQuery")}}</template>
    <template slot="search">
      <Form inline>
        <FormItem>
          <Input v-model="form.key" :placeholder="$t('product.attribute.placeholder')" style="width: 300px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">{{$t("common.search")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="data-title">
      {{$t("product.attribute.titleList")}}
    </template>

    <template slot="data-tree">
      <Tree :data="properties" @on-select-change="treeChange"></Tree>
    </template>

    <template slot="data-tree-btns">
      <Button type="ghost" @click="addProperty">{{$t("common.create")}}</Button>
      <Button type="ghost" :disabled="$disabled" @click="editProperty">{{$t("common.edit")}}</Button>
      <Button type="ghost" :disabled="$disabled" @click="removeProperty">{{$t("common.remove")}}</Button>
    </template>

    <template slot="data-table-btns">
      <Button type="primary" :disabled="$disabled" @click="addPropertyDetail">{{$t("common.create")}}</Button>
    </template>

    <template slot="data-table">
      <Table :loading="table.loading" :columns="table.cols" :data="table.data" :height="$layoutTree.tableHeight"></Table>
    </template>

    <template slot="data-page">
      <gvt-page :pagination="pagination" @on-page-size-change="pageSizeChange" @on-page-change="pageChange"></gvt-page>
    </template>

    <property-add-modal :visible.sync="propertyModal.add" @success="fetchProperties"></property-add-modal>

    <property-edit-modal :visible.sync="propertyModal.edit" :id="selectedProperty.id" @success="fetchProperties"></property-edit-modal>

    <property-detail-add-modal :visible.sync="propertyDetailModal.add" :property-id="selectedProperty.id" @success="search"></property-detail-add-modal>

    <property-detail-edit-modal :visible.sync="propertyDetailModal.edit" :property-detail-id="selectedPropertyDetail" @success="loadData"></property-detail-edit-modal>

  </gvt-layout-tree>
</template>

<script>
import { layout_tree_break } from "../../../mixins/layout-tree-break";
import * as PROPERTY from "../../../api/property";
import * as DETAIL from "../../../api/property-detail";
import { PAGE_PARAMS } from "../../../constants";
import PropertyAddModal from "./components/PropertyAddModal";
import PropertyEditModal from "./components/PropertyEditModal";
import PropertyDetailAddModal from "./components/PropertyDetailAddModal";
import PropertyDetailEditModal from "./components/PropertyDetailEditModal";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_tree_break],

  components: { PropertyAddModal, PropertyEditModal, PropertyDetailAddModal, PropertyDetailEditModal },

  data() {
    return {
      propertyModal: {
        add: false,
        edit: false
      },

      propertyDetailModal: {
        add: false,
        edit: false
      },

      form: {
        key: "",
        propertyId: ""
      },

      pagination: Object.assign({}, PAGE_PARAMS),

      properties: [
        {
          title: i18n.t("product.attribute.ppGroup"),
          expand: true,
          disabled: true,
          children: []
        }
      ],

      table: {
        loading: false,
        cols: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.attribute.code"),
            key: "code"
          },
          {
            title: i18n.t("product.attribute.name"),
            key: "name"
          },
          {
            title: i18n.t("product.attribute.description"),
            key: "description"
          },
          {
            title: i18n.t("product.attribute.status"),
            key: "status",
            render: (h, params) => {
              const status = params.row.status;
              const text = status === true ? i18n.t("product.attribute.enable") : i18n.t("product.attribute.disable");
              return h("span", text);
            }
          },
          {
            title: i18n.t("common.operate"),
            key: "CRUD",
            align: "center",
            render: (h, params) => {
              const editBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.selectedPropertyDetail = params.row.id;
                      this.editPropertyDetail();
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
                      this.selectedPropertyDetail = params.row.id;
                      this.removePropertyDetail();
                    }
                  }
                },
                i18n.t("common.remove")
              );
              return h("span", [editBtn, removeBtn]);
            }
          }
        ],
        data: []
      },

      selectedProperty: {},

      selectedPropertyDetail: ""
    };
  },

  computed: {
    $disabled() {
      return this.selectedProperty.id ? false : true;
    }
  },

  created() {
    this.fetchProperties();
    this.loadData();
  },

  methods: {
    fetchProperties() {
      PROPERTY.list().then(response => {
        this.properties[0].children = response.data.map(item => {
          item.title = item.name;
          return item;
        });
      });
    },

    treeChange(arr) {
      if (arr.length === 0) {
        this.form.propertyId = "";
        this.selectedProperty = {};
      } else {
        const obj = arr[0];
        this.form.propertyId = obj.id;
        this.selectedProperty = Object.assign(
          {},
          { id: obj.id, name: obj.name }
        );
      }
      this.loadData();
    },

    loadData() {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      DETAIL.listPage(params)
        .then(response => {
          this.pagination.total = response.data.total;
          this.table.data = response.data.list;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    search() {
      this.pagination.current = 1;
      this.loadData();
    },

    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },

    pageChange() {
      this.loadData();
    },

    addProperty() {
      this.propertyModal.add = true;
    },

    addPropertyDetail() {
      this.propertyDetailModal.add = true;
    },

    editProperty() {
      this.propertyModal.edit = true;
    },

    editPropertyDetail() {
      this.propertyDetailModal.edit = true;
    },

    removeProperty() {
      PROPERTY.removejudge(this.selectedProperty.id).then(response => {
        if(response.data.pass) {
          this.$Modal.confirm({
            title: i18n.t("common.notify"),
            content: i18n.t("common.removeNotice"),
            onOk: () => {
              this.doRemoveProperty();
            }
          });
        } else {
          this.$Modal.info({
            title: i18n.t("common.notify"),
            content: i18n.t("product.attribute.notice", {notice: response.data.messages[0]})
          });
        }
      });
    },

    doRemoveProperty() {
      PROPERTY.remove(this.selectedProperty.id)
        .then(response => {
          this.form.propertyId = "";
          this.selectedProperty = {};
          this.$Message.success(i18n.t("common.success"));
          this.fetchProperties();
          this.loadData();
        })
        .catch(error => {
          this.$Message.error(error.message);
        });
    },

    removePropertyDetail(){
      DETAIL.removejudge(this.selectedPropertyDetail).then(response => {
        if(response.data.pass) {
          this.$Modal.confirm({
            title: i18n.t("common.notify"),
            content: i18n.t("common.removeNotice"),
            onOk: () => {
              this.doRemovePropertyDetail();
            }
          });
        } else {
          this.$Modal.info({
            title: i18n.t("common.notify"),
            content: i18n.t("product.attribute.notice", {notice: response.data.messages[0]})
          });
        }
      });
    },

    doRemovePropertyDetail() {
      DETAIL.remove(this.selectedPropertyDetail)
        .then(response => {
          this.loadData();
          this.$Message.success(i18n.t("common.success"));
        })
        .catch(error => {
          this.$Message.error(error.message);
        });
    },

  }
};
</script>
