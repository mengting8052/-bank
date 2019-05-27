<template>
  <gvt-layout-tree>
    <template slot="title">
      {{$t("product.category.titleQuery")}}
    </template>

    <template slot="search">
      <Form inline :model="form" :label-width="80" ref="search-form">
        <FormItem :label="$t('product.category.name')" prop="name">
          <Input type="text" v-model="form.name"></Input>
        </FormItem>
        <FormItem :label="$t('product.category.code')" prop="code">
          <Input type="text" v-model="form.code"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">{{$t("common.search")}}</Button>
          <Button type="ghost" @click="reset">{{$t("common.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="data-title">
      {{$t("product.category.titleList")}}
    </template>

    <template slot="data-tree">
      <Tree :data="tree" @on-select-change="treeChange"></Tree>
    </template>

    <template slot="data-tree-btns">
      <Button type="ghost" @click="createBtnClick">{{$t("common.create")}}</Button>
      <Button type="ghost" :disabled="$disabled" @click="visible = !visible">{{$t("common.edit")}}</Button>
      <Button type="ghost" :disabled="$disabled" @click="removeCategory">{{$t("common.remove")}}</Button>
    </template>

    <template slot="data-table-btns">
      <div style="text-align: left;">
        <Button type="primary" @click="createSecondCategory">{{$t("product.category.createSecondCategory")}}</Button>
      </div>
    </template>

    <template slot="data-table">
      <Table :loading="table.loading" :data="table.data" :columns="table.cols" :height="$layoutTree.tableHeight"></Table>
    </template>

    <template slot="data-page">
      <gvt-page :pagination="pagination" @on-page-size-change="pageSizeChange" @on-page-change="pageChange"></gvt-page>
    </template>

    <create-or-update-modal :visible.sync="visible" :category-id="categoryId" @on-success="fetchTree"></create-or-update-modal>

  </gvt-layout-tree>
</template>

<script>
import { layout_tree_break } from "../../../mixins/layout-tree-break";
import { PAGE_PARAMS } from "../../../constants";
import * as CATEGORY from "../../../api/category";
import CreateOrUpdateModal from "./components/CreateOrUpdateModal";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_tree_break],

  components: { CreateOrUpdateModal },

  data() {
    return {
      visible: false,

      form: {
        code: "",
        name: ""
      },

      tree: [
        {
          title: i18n.t("product.category.parentName"),
          expand: true,
          disabled: true,
          children: []
        }
      ],

      categoryId: "",

      table: {
        loading: false,
        cols: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.category.code"),
            key: "code"
          },
          {
            title: i18n.t("product.category.name"),
            key: "name"
          },
          {
            title: i18n.t("product.category.parentName"),
            key: "parentName"
          },
          {
            title: i18n.t("product.category.sort"),
            key: "sort"
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
                      this.$router.push({
                        name: "product-category-edit",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                i18n.t("common.edit"),
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
                      this.$Modal.confirm({
                        title: i18n.t("common.notify"),
                        content: i18n.t("common.removeNotice"),
                        onOk: () => {
                          CATEGORY.remove(params.row.id)
                            .then(response => {
                              this.$Message.success(i18n.t("common.success"));
                              this.loadData();
                            })
                            .catch(error => {
                              this.$Message.error(error.message);
                            });
                        }
                      });
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

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  computed: {
    $disabled() {
      return this.categoryId === "" ? true : false;
    }
  },

  created() {
    this.fetchTree();
    this.loadData();
  },

  methods: {
    createBtnClick() {
      this.categoryId = ""
      this.visible = !this.visible
    },

    createSecondCategory() {
      const route = this.categoryId ? {name: 'product-category-create', query: { parentId: this.categoryId}} : {name: 'product-category-create'}
      this.$router.push(route)
    },

    fetchTree() {
      this.categoryId = "";
      this.tree[0].children.length = 0;
      CATEGORY.listAllTree().then(response => {
        response.data.map(item => {
          const obj = { id: item.value, title: item.label, name: item.label };
          this.tree[0].children.push(obj);
        });
      });
    },

    treeChange(arr) {
      if (arr.length === 0) {
        this.categoryId = "";
      } else {
        const obj = arr[0];
        this.categoryId = obj.id;
      }
      this.pageSizeChange();
    },

    search() {
      this.pageSizeChange();
    },

    reset() {
      this.$refs["search-form"].resetFields();
    },

    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },

    pageChange() {
      this.loadData();
    },

    loadData() {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        parentId: this.categoryId,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });

      CATEGORY.listPage(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    removeCategory() {
      this.$Modal.confirm({
        title: i18n.t("common.notify"),
        content: i18n.t("common.removeNotice"),
        onOk: () => {
          this.doRemoveCategory();
        }
      });
    },

    doRemoveCategory() {
      CATEGORY.remove(this.categoryId)
        .then(response => {
          this.fetchTree();
          this.loadData();
        })
        .catch(error => {
          this.$Message.error(error.message);
        });
    }
  }
};
</script>

