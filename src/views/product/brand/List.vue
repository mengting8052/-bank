<template>
  <gvt-layout>
    <template slot="title">{{$t("product.brand.titleQuery")}}</template>

    <template slot="search">
      <Form ref="searchForm" :label-width="80" inline>
        <FormItem :label="$t('product.brand.name')" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem :label="$t('product.brand.code')" prop="code">
          <Input v-model="form.code"></Input>
        </FormItem>
        <Button type="primary" @click="submit">{{$t("common.search")}}</Button>
        <Button type="ghost" @click="reset">{{$t("common.reset")}}</Button>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="addBrand">{{$t("common.create")}}</Button>
    </template>

    <template slot="data-title">{{$t("product.brand.titleList")}}</template>

    <template slot="data-table">
      <Table
        :columns="table.columns"
        :data="table.data"
        :loading="table.loading"
        :height="$layout.tableHeight"
      ></Table>
    </template>

    <template slot="data-page">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="pageSizeChange"
        @on-page-change="pageChange"
      ></gvt-page>
    </template>

    <template>
      <Modal v-model="addModel.show" :title="$t('common.create')">
        <Form :label-width="80" ref="addModel" :rules="fromRules" :model="addModel.brand">
          <FormItem :label="$t('product.brand.name')" prop="name">
            <Input v-model="addModel.brand.name" style="width:300px"></Input>
          </FormItem>
          <FormItem :label="$t('product.brand.sort')" prop="sort" required>
            <Input v-model.number="addModel.brand.sort" style="width:300px"></Input>
          </FormItem>
        </Form>
        <template slot="footer">
          <Button type="ghost" @click="addModel.show=!addModel.show">{{$t("common.cancel")}}</Button>
          <Button type="primary" @click="add" :loading="addModel.loading">{{$t("common.confirm")}}</Button>
        </template>
      </Modal>
      <Modal v-model="editModel.show" :title="$t('common.edit')">
        <Form :label-width="80" ref="editModel" :rules="fromRules" :model="editModel.brand">
          <FormItem :label="$t('product.brand.code')" prop="code">
            <Input v-model="editModel.brand.code" style="width:300px" readonly></Input>
          </FormItem>
          <FormItem :label="$t('product.brand.name')" prop="name" required>
            <Input v-model="editModel.brand.name" style="width:300px"></Input>
          </FormItem>
          <FormItem :label="$t('product.brand.sort')" prop="sort" required>
            <Input v-model.number="editModel.brand.sort" style="width:300px"></Input>
          </FormItem>
        </Form>
        <template slot="footer">
          <Button type="ghost" @click="editModel.show=!editModel.show">{{$t("common.cancel")}}</Button>
          <Button type="primary" @click="update" :loading="editModel.loading">{{$t("common.confirm")}}</Button>
        </template>
      </Modal>
    </template>
    
  </gvt-layout>
</template>
<script>
import { BRAND_SEARCH_FORM } from "../../../validation/index";
import { layout_break } from "../../../mixins/layout.js";
import * as API from "../../../api/brand.js";
import { PAGE_PARAMS } from "../../../constants";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_break],
  data() {
    return {
      form: {
        name: "",
        code: ""
      },
      table: {
        loading: false,
        columns: [
          {
            title: "#",
            type: "index",
            width: 60
          },
          {
            title: i18n.t("product.brand.code"),
            key: "code"
          },
          {
            title: i18n.t("product.brand.name"),
            key: "name"
          },
          {
            title: i18n.t("product.brand.sort"),
            key: "sort"
          },
          {
            title: i18n.t("common.createTime"),
            key: "createTime",
            render: (h, params) => {
              return h(
                "span",
                this.$options.filters.timeFormat(params.row.createTime)
              );
            }
          },
          {
            title: i18n.t("common.operate"),
            key: "action",
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
                      this.edit(params);
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
                      this.remove(params);
                    }
                  }
                },
                i18n.t("common.remove"),
              );
              return h("span", [editBtn, removeBtn]);
            }
          }
        ],
        data: []
      },
      fromRules: BRAND_SEARCH_FORM,
      pagination: Object.assign({}, PAGE_PARAMS),
      addModel: {
        show: false,
        loading: false,
        brand: {
          name: "",
          sort: ""
        }
      },
      editModel: {
        show: false,
        loading: false,
        brand: {
          code: "",
          name: "",
          sort: "",
          id: ""
        }
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    pageChange() {
      this.loadData();
    },
    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },
    loadData() {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      API.listPage(params)
        .then(response => {
          this.table.loading = false;
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
        })
        .catch();
    },
    submit() {
      this.pagination.current = 1;
      this.loadData();
    },
    reset() {
      this.form = {
        name: "",
        code: ""
      };
    },
    edit(params) {
      const brand = params.row;
      this.editModel.brand = Object.assign(
        {},
        {
          name: brand.name,
          code: brand.code,
          sort: brand.sort,
          id: brand.id
        }
      );
      this.editModel.show = true;
    },
    remove(params) {
      var _self = this;
      _self.$Modal.confirm({
        title: i18n.t("common.notify"),
        content: i18n.t("common.removeNotice"),
        onOk() {
          API.remove(params.row.id)
            .then(response => {
              _self.table.data.splice(params.index, 1);
              _self.$Message.success(i18n.t("common.success"));
            })
            .catch(error => {
              _self.$Message.error(error.message);
            });
        },
        onCancel() {}
      });
    },
    addBrand() {
      this.addModel.show = !this.addModel.show;
      this.addModel.brand = {
        name: "",
        sort: ""
      };
    },
    add() {
      this.$refs["addModel"].validate(valid => {
        if (valid) {
          this.addModel.loading = true;
          API.add(this.addModel.brand)
            .then(response => {
              this.addModel.show = false;
              this.$Message.success(i18n.t("common.success"));
              this.addModel.loading = false;
              this.loadData();
            })
            .catch(error => {
              this.$Message.error(error.message);
              this.addModel.loading = false;
            });
        }
      });
    },
    update() {
      this.$refs["editModel"].validate(valid => {
        if (valid) {
          this.editModel.loading = true;
          API.update(this.editModel.brand)
            .then(response => {
              this.editModel.show = false;
              this.$Message.success(i18n.t("common.success"));
              this.editModel.loading = false;
              this.loadData();
            })
            .catch(error => {
              this.$Message.error(error.message);
              this.editModel.loading = false;
            });
        }
      });
    }
  }
};
</script>

