
<template>
  <div class="logistics">
    <gvt-layout>
      <template slot="title">{{$t("logistics.title")}}</template>

      <template slot="search">
        <Form inline :label-width="80" ref="search-form" :model="form">
          <FormItem :label="$t('logistics.logisticsCode')" prop="logisticsCode">
            <Select v-model="form.logisticsCode" style="width:200px" clearable>
              <Option
                v-for="item in logisticsList"
                :value="item.value"
                :key="item.index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('logistics.productBarCode')" prop="barCode">
            <Input v-model="form.barCode" clearable style="width:200px"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button type="ghost" @click="reset" style="margin-left:8px">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </template>

      <template slot="btn-groups">
        <Button type="primary" @click="addModalShow" style="margin-left:8px">{{$t('common.create')}}</Button>
      </template>

      <template slot="data-title"></template>

      <template slot="data-table">
        <Table
          :data="table.data"
          :columns="table.clos"
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
        <!-- 新增弹窗 -->
        <Modal :title="$t('common.create')" v-model="addModal.show">
          <Form
            inline
            ref="addForm"
            :label-width="100"
            :model="addModal.product"
            :rules="addModal.rules"
          >
            <FormItem :label="$t('logistics.logisticsCode')" prop="logisticsCode">
              <Select v-model="addModal.product.logisticsCode" style="width:300px">
                <Option
                  v-for="item in logisticsList"
                  :value="item.value"
                  :key="item.index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('logistics.productName')" prop="productName">
              <Input
                v-model="addModal.product.productName"
                icon="search"
                disabled
                @on-click="addProduct"
                style="width:300px"
              ></Input>
            </FormItem>
          </Form>
          <template slot="footer">
            <Button type="ghost" @click="cancelAddModal">{{$t('common.cancel')}}</Button>
            <Button type="primary" @click="add">{{$t('common.confirm')}}</Button>
          </template>
        </Modal>
        <!-- 编辑弹窗 -->
        <Modal :title="$t('common.edit')" v-model="editModal.show">
          <Form
            inline
            ref="editForm"
            :label-width="100"
            :model="editModal.product"
            :rules="editModal.rules"
          >
            <FormItem :label="$t('logistics.logisticsCode')" prop="logisticsCode">
              <Select v-model="editModal.product.logisticsCode" style="width:300px">
                <Option
                  v-for="item in logisticsList"
                  :value="item.value"
                  :key="item.index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('logistics.productName')" prop="productName">
              <Input
                v-model="editModal.product.productName"
                disabled
                icon="search"
                @on-click="searchProduct"
                style="width:300px"
              ></Input>
            </FormItem>
          </Form>
          <template slot="footer">
            <Button type="ghost" @click="cancelEditModal">{{$t('common.cancel')}}</Button>
            <Button type="primary" @click="update">{{$t('common.confirm')}}</Button>
          </template>
        </Modal>
      </template>
      <selectProduct :tableShow.sync="tableShow" :modal="modal" @success="success"></selectProduct>
    </gvt-layout>
  </div>
</template>
<script>
import {
  listPage,
  logisticsList,
  add,
  update,
  remove
} from "../../../api/filing_d";
import { PAGE_PARAMS } from "../../../constants";
import { layout_break } from "../../../mixins/layout";
import selectProduct from "../portProdct/components/selectProduct";
import { i18n } from "../../../setup/i18n-setup.js"

export default {
  mixins: [layout_break],
  components: { selectProduct },
  data() {
    return {
      form: {
        // 物流公司
        logisticsCode: "",
        // 商品条形码
        barCode: ""
      },
      logisticsList: [],
      table: {
        loading: false,
        data: [],
        clos: [
          {
            title: "#",
            type: "index",
            align: "center"
          },
          {
            title: i18n.t("logistics.logisticsCode"),
            key: "logisticsName"
          },
          {
            title: i18n.t("logistics.productBarCode"),
            key: "productBarCode"
          },
          {
            title: i18n.t("logistics.productName"),
            key: "productName"
          },
          {
            title: i18n.t("common.operate"),
            key: "active",
            align: "center",
            render: (h, params) => {
              var editBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: ["edit-btn"],
                  on: {
                    click: () => {
                      this.editModal.show = true;
                      this.edit(params.row);
                    }
                  }
                },
                i18n.t("common.edit"),
              );
              var removeBtn = h(
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
                          remove(params.row.id)
                            .then(response => {
                              this.$Message.success(i18n.t("common.success"),);
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
                i18n.t("common.remove"),
              );
              return h("span", [editBtn, removeBtn]);
            }
          }
        ]
      },
      pagination: Object.assign({}, PAGE_PARAMS),
      editModal: {
        loading: false,
        show: false,
        product: {
          id: "",
          //   物流公司
          logisticsCode: "",
          //   备案商品
          productName: "",
          skuId: ""
        },
        rules: {
          logisticsCode: [
            { required: true, message: i18n.t("logistics.logisticsCodeRequired"), trigger: "blur" }
          ],
          productName: [
            { required: true, message: i18n.t("logistics.productNameRequired"), trigger: "blur" }
          ]
        }
      },
      addModal: {
        loading: false,
        show: false,
        product: {
          logisticsCode: "",
          productName: "",
          skuId: ""
        },
        rules: {
          logisticsCode: [
            { required: true, message: i18n.t("logistics.logisticsCodeRequired"), trigger: "blur" }
          ],
          productName: [
            { required: true, message: i18n.t("logistics.productNameRequired"), trigger: "blur" }
          ]
        }
      },
      tableShow: false, //控制选择商品表格显示隐藏
      modal: "" //用来区分是编辑弹窗还是新增弹窗
    };
  },
  created() {
    this.loadData();
    this.getlogisticsList();
  },
  methods: {
    // 获取物流下拉框数据
    getlogisticsList() {
      logisticsList().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.label = item.nameZh;
          obj.value = item.code;
          this.logisticsList.push(obj);
        });
      });
    },
    search() {
      this.pagination.current = 1;
      this.loadData();
    },
    reset() {
      this.$refs["search-form"].resetFields();
    },
    //  新增
    addModalShow() {
      this.$refs["addForm"].resetFields();
      this.addModal.show = true;
    },
    pageSizeChange() {
      this.pagination.current = 1;
      this.loadData();
    },
    pageChange() {
      this.loadData();
    },
    //  获取列表数据
    loadData() {
      this.table.loading = true;
      const params = Object.assign({}, this.form, {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      });
      listPage(params)
        .then(response => {
          this.pagination.total = response.data.total;
          this.table.data = response.data.list;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },
    // 编辑
    edit(params) {
      console.log(params);
      this.editModal.product = {
        id: params.id,
        logisticsCode: params.logisticsCode,
        productName: params.productBarCode + "-" + params.productName,
        skuId: params.skuId
      };
    },
    // 添加商品
    addProduct() {
      this.modal = "add"; //传递给自组建新增信息
      this.tableShow = true;
    },
    searchProduct() {
      this.modal = "edit";
      this.tableShow = true;
    },
    // 成功添加商品
    success(val) {
      if (val.modal === "edit") {
        this.editModal.product.productName =
          val.selectData.barCode + "-" + val.selectData.name; //更新备案商品 条码+名称
        this.editModal.product.skuId = val.selectData.skuId;
        this.tableShow = false;
      } else {
        this.addModal.product.productName =
          val.selectData.barCode + "-" + val.selectData.name; //更新备案商品 条码+名称
        this.addModal.product.skuId = val.selectData.skuId;
        this.tableShow = false;
      }
    },
    // 新增
    add() {
      const data = {
        skuId: this.addModal.product.skuId, //商品id
        logisticsCode: this.addModal.product.logisticsCode //物流
      };
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addModal.loading = true;
          add(data)
            .then(response => {
              this.addModal.loading = false;
              this.addModal.show = false;
              this.$Message.success(i18n.t("common.success"));
              this.loadData();
            })
            .catch(error => {
              this.addModal.loading = false;
            });
        }
      });
    },
    //提交修改数据
    update() {
      const data = {
        id: this.editModal.product.id,
        skuId: this.editModal.product.skuId, //商品id
        logisticsCode: this.editModal.product.logisticsCode //物流
      };
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.editModal.loading = true;
          update(data)
            .then(response => {
              this.addModal.loading = false;
              this.editModal.show = false;
               this.$Message.success(i18n.t("common.success"));
              this.loadData();
            })
            .catch(error => {
              this.editModal.loading = false;
            });
        }
      });
    },
    cancelAddModal() {
      this.addModal.show = false;
      this.$refs["addForm"].resetFields();
    },
    cancelEditModal() {
      this.editModal.show = false;
      this.$refs["editForm"].resetFields();
    }
  }
};
</script>

