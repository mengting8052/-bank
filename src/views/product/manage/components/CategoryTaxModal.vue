<style lang="less">
.tax-tree-wrapper, .tax-table-wrapper {
  height: 500px;
}
.tax-tree-wrapper {
  overflow-y: scroll;
  &::-webkit-scrollbar{
    display: none;
  }
}
</style>


<template>
  <Modal v-model="show" :title="$t('product.categoryTaxModal.title')" width="800" @on-visible-change="visibleChange">
    <Row>
      <Col span="6" class-name="tax-tree-wrapper">
        <Tree :data="tree" @on-select-change="selectChange"></Tree>      
      </Col>
      <Col span="18" class-name="tax-table-wrapper">
        <Table :height="450" :loading="table.loading" :data="table.data" :columns="table.cols" @on-selection-change="selectionChange"></Table> 
        <div style="margin-top:20px;text-align: right;">
          <gvt-page :pagination="pagination" @on-page-size-change="loadData(true)" @on-page-change="loadData"></gvt-page>
        </div>
      </Col>
    </Row>

    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirmAndClose(false)">{{$t("common.choose")}}</Button>
      <Button type="primary" @click="confirmAndClose(true)">{{$t("common.confirmAndChoose")}}</Button>
    </div>

  </Modal>
</template>

<script>
import { listPage, listTree } from "../../../../api/category-tax";
import { PAGE_PARAMS } from "../../../../constants";
import { i18n } from "../../../../setup/i18n-setup.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      show: this.visible,

      tree: [
        {
          title: i18n.t("product.categoryTaxModal.nation"),
          expand: true,
          disabled: true,
          children: []
        }
      ],

      selectedTree: {},

      pagination: Object.assign({}, PAGE_PARAMS),

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
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: i18n.t("product.categoryTaxModal.nation"),
            key: "nation",
          },
          {
            title: i18n.t("product.categoryTaxModal.province"),
            key: "province",
          },
          {
            title: i18n.t("product.categoryTaxModal.code"),
            key: "code",
          },
          {
            title: i18n.t("product.categoryTaxModal.name"),
            key: "name",
          },
          {
            title: i18n.t("product.categoryTaxModal.remark"),
            key: "remark"
          }
        ]
      },

      selection: []
    };
  },

  watch: {
    visible(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:visible", val);
    }
  },

  methods: {
    visibleChange(val) {
      if(val) {
        // 每一次展示都初始化全部数据
        this.fetchTree();
        this.loadData(true);
      }
    },

    fetchTree() {
      this.selectedTree = {};
      this.tree[0].children.length = 0;
      listTree().then(response => {
        response.data.map(item => {
          const obj = {
            title: item.nation,
            condition: {nation: item.nation},
            expand: true, 
            children: item.provinces.map(v => ({title: v, condition: {province: v}}))
          }
          this.tree[0].children.push(obj);
        })
      })
    },

    selectChange(arr) {
      if(arr.length === 0){
        this.selectedTree = {};
      }else{
        const obj = arr[0];
        this.selectedTree = obj.condition;
      }
      this.loadData(true);
    },

    loadData(reload = false){
      this.table.loading = true;
      if(reload) this.pagination.current = 1;
      let params = Object.assign({}, this.selectedTree, {pageNum: this.pagination.current, pageSize: this.pagination.pageSize});
      params.status = true;
      const parentData = this.$parent.table.data;
      listPage(params).then(response => {
        this.table.data = response.data.list.map(item => {
          let found = false;
          if(parentData.length) found = parentData.find(v => v.taxId == item.id);
          return found ? Object.assign({}, item, {taxId: item.id, _checked: true}) : Object.assign({}, item, {taxId: item.id, _checked: false})
        });
        this.pagination.total = response.data.total; 
        this.table.loading = false;
      }).catch(error => {
        this.table.loading = false;        
      });
    },

    selectionChange(selection){
      this.selection = selection;
    },

    confirmAndClose(close_modal){
      if(close_modal) this.show = false; 
      this.$emit("selection-choosed", this.selection);
    }
  }
};
</script>

