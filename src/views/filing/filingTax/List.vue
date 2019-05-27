<template>
  <gvt-layout-tree dis-title>
    <template slot="search">
      <Form inline :label-width="80" :model="form" ref="searchForm">
        <FormItem :label="$t('filingTax.gvtCode')" prop="gvtCode">
          <Input type="text" v-model="form.gvtCode"></Input>
        </FormItem>
        <FormItem :label="$t('filingTax.hscode')" prop="hscode">
          <Input type="text" v-model="form.hscode"></Input>
        </FormItem>
        <FormItem :label="$t('filingTax.name')" prop="name">
          <Input type="text" v-model="form.name"></Input>
        </FormItem>
        <Button type="primary" @click="loadData(true)">{{$t('common.search')}}</Button>
        <Button type="ghost" @click="resetForm">{{$t('common.reset')}}</Button>
      </Form>
    </template>

    <template slot="data-title">{{$t('filingTax.title')}}</template>

    <template slot="data-tree">
      <Tree :data="taxs" @on-select-change="treeChange"></Tree>
    </template>

    <template slot="data-table-btns">
      <Button type="primary" @click="$router.push({name: 'filing-filingTax-create'})">{{$t('common.create')}}</Button>
    </template>

    <template slot="data-table">
      <Table
        :loading="table.loading"
        :data="table.data"
        :columns="table.columns"
        :height="$layoutTree.tableHeight"
      ></Table>
    </template>

    <template slot="data-page">
      <gvt-page
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData()"
      ></gvt-page>
    </template>
  </gvt-layout-tree>
</template>

<script>
import { layout_tree_break } from "../../../mixins/layout-tree-break";
import { PAGE_PARAMS } from "../../../constants";
import { list, remove } from "../../../api/tax";
import { fetchAllHscodes, removeHscodes } from "../../../api/hscodes"
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_tree_break],

  data() {
    return {
      taxs: [
        {
          title: i18n.t("filingTax.country"),
          expand: true,
          disabled: true,
          children: []
        }
			],
			
      form: {
        nationCode: "",
				provinceCode: "",
				name: "",
				hscode: "",
				gvtCode: ""
      },


      pagination: Object.assign({}, PAGE_PARAMS),

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
						title: i18n.t("filingTax.gvtCode"),
						key: "gvtCode"
					},
					{
						title: i18n.t("filingTax.hscode"),
						key: "hscode"
					},
					{
						title: i18n.t("filingTax.name"),
						key: "name"
					},
					{
						title: i18n.t("filingTax.tflu"),
						key: "tflu"
          },
          {
            title: i18n.t("filingTax.slu"),
            key: "slu"
          },
					{
						title: i18n.t("common.operate"),
						align: "center",
						key: "CURD",
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
											this.$router.push({name: "filing-filingTax-edit", query: {id: params.row.id}})
										}
									}
								},
								i18n.t("common.edit")
							)

							const removeBtn = h(
								"Button",
								{
									props: {
										type: "text",
									},
									class: ["remove-btn"],
									on: {
										click: () => {
											this.$Modal.confirm({
												title: i18n.t("common.notify"),
												content: i18n.t("common.removeNotice"),
												loading: true,
												onOk: () => {
													removeHscodes(params.row.id).then(response => {
														this.$Message.success(i18n.t("common.success"))
														this.loadData()
														this.$Modal.remove()
													}).catch(error => {
														this.$Message.error(error.message)
														this.$Modal.remove()
													})
												}
											})
										}
									}
								},
							  i18n.t("common.remove")
							)

							return h("span", [editBtn, removeBtn])
						}
					}
				]
      }
    };
  },

  created() {
    this.initTaxs();
    this.loadData();
  },

  methods: {
    initTaxs() {
      list().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.title = obj.label = item.nation;
          obj.value = item.nationCode;
          obj.type = "nationCode";
          obj.children = [];
          if (item.provinces && item.provinces.length) {
            obj.children = item.provinces.map(v => {
              return { title: v.province, label: v.province, value: v.provinceCode, type: "provinceCode" };
            });
          }
          this.taxs[0]["children"].push(obj);
        });
      });
		},

    treeChange(arr) {
      this.form.nationCode = "";
      this.form.provinceCode = "";
      if (arr.length) {
        const selected = arr[0];
        this.form[selected.type] = selected.value
      }
      this.loadData(true);
    },

    loadData(reload = false) {
		  this.table.loading = true;
      reload && (this.pagination.current = 1);
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
			fetchAllHscodes(params).then(response => {
				this.pagination.total = response.data.total
				this.table.data = response.data.list
				this.$nextTick(() => {
					this.table.loading = false
				})
			}).catch(error => {
				this.table.loading = false
			})
		},

		resetForm() {
			this.$refs["searchForm"].resetFields()
		}
  }
};
</script>

