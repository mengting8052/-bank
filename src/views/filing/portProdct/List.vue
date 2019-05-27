<template>
  <div class="propProduct">
    <gvt-layout>
      <template slot="title">{{$t("portProduct.title")}}</template>
      <template slot="search">
        <Form inline :label-width="80" ref="search-form">
          <FormItem :label="$t('portProduct.customId')" prop="customId">
            <Select v-model="form.customId" style="width:200px" clearable>
              <Option v-for="item in customs" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('portProduct.barCode')" prop="barCode">
            <Input v-model="form.barCode" clearable style="width:200px"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">{{$t("common.search")}}</Button>
            <Button type="ghost" @click="reset" style="margin-left:8px">{{$t("common.reset")}}</Button>
          </FormItem>
        </Form>
      </template>

      <template slot="btn-groups">
        <Button type="primary" @click="addModalShow" style="margin-left:8px">{{$t("common.create")}}</Button>
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
        <Modal v-model="editModal.show" :title="$t('common.edit')">
          <Form inline ref="editForm" :label-width="100">
            <FormItem :label="$t('portProduct.customId')" prop="customId">
              <Select v-model="editModal.customs.customId" style="width:300px">
                <Option
                  v-for="item in customs"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('portProduct.taxRecordId')" prop="taxRecordId">
              <Select v-model="editModal.customs.taxRecordId" style="width:300px">
                <Option
                  v-for="item in taxRecords"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('portProduct.productName')" prop="productName">
              <Input
                v-model="editModal.customs.productName"
                disabled
                icon="search"
                @on-click="searchProduct"
                style="width: 400px"
              ></Input>
            </FormItem>
            <FormItem :label="$t('portProduct.price')" prop="price">
              <Input style="width:150px;display:inline-block" v-model="editModal.customs.price"></Input>
              <Select
                v-model="editModal.customs.currencyId"
                style="width:150px;display:inline-block"
              >
                <Option
                  v-for="item in currencyList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Form>
          <template slot="footer">
            <Button type="ghost" @click="editModal.show=!editModal.show">{{$t("common.cancel")}}</Button>
            <Button type="primary" @click="update">{{$t("common.confirm")}}</Button>
          </template>
        </Modal>

        <Modal v-model="addModal.show" :title="$t('common.create')">
          <Form inline ref="addForm" :label-width="100" :rules="rules" :model="addModal.customs">
            <FormItem :label="$t('portProduct.customId')" prop="customId" required>
              <Select v-model="addModal.customs.customId" style="width:300px">
                <Option v-for="item in customs" :value="item.value" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('portProduct.taxRecordId')" prop="taxRecordId" required>
              <Select v-model="addModal.customs.taxRecordId" style="width:300px">
                <Option
                  v-for="item in taxRecords"
                  :value="item.value"
                  :key="item.id"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('portProduct.productName')" prop="productName">
              <Input
                v-model="addModal.customs.productName"
                disabled
                icon="search"
                @on-click="addProduct"
                style="width:300px"
              ></Input>
            </FormItem>
            <FormItem :label="$t('portProduct.price')" prop="price">
              <Input style="width:150px;display:inline-block" v-model="addModal.customs.price"></Input>
              <Select
                v-model="addModal.customs.currencyId"
                style="width:150px;display:inline-block"
                :placeholder="$t('portProduct.currencyId')"
              >
                <Option
                  v-for="item in currencyList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Form>
          <template slot="footer">
            <Button type="ghost" @click="addModal.show=!addModal.show">{{$t("common.cancel")}}</Button>
            <Button type="primary" @click="add">{{$t("common.confirm")}}</Button>
          </template>
        </Modal>
        <selectProduct :tableShow.sync="tableShow" :modal="modal" @success="success"></selectProduct>
      </template>
    </gvt-layout>
  </div>
</template>
<script>
import { PAGE_PARAMS } from "../../../constants";
import { layout_break } from "../../../mixins/layout";
import {
  listPage,
  add,
  update,
  remove,
  taxRecord,
  currency,
  customs
} from "../../../api/filing-c";
import selectProduct from "./components/selectProduct";
import { i18n } from "../../../setup/i18n-setup.js";

export default {
  mixins: [layout_break],
  components: {
    selectProduct
  },
  data() {
    return {
      form: {
        // 备案口岸
        customId: "",
        // 备案条形码
        barCode: ""
      },
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
            title: i18n.t("portProduct.customName"),
            key: "customName"
          },
          {
            title: i18n.t("portProduct.taxRecordName"),
            key: "taxRecordName"
          },
          {
            title: i18n.t("portProduct.productBarCode"),
            key: "productBarCode"
          },
          {
            title: i18n.t("portProduct.productName"),
            key: "productName"
          },
          {
            title: i18n.t("portProduct.price"),
            key: "price"
          },
          {
            title: i18n.t("portProduct.currencyName"),
            key: "currencyName"
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
        ]
      },
      addModal: {
        show: false,
        loading: false,
        customs: {
          currencyId: "", //币制Id
          customId: "", //口岸
          price: "", //备案价格
          skuId: "", //商品id
          productName: "",
          taxRecordId: "" //税则id
        }
      },
      editModal: {
        show: false,
        loading: false,
        customs: {
          id: "",
          currencyId: "", //币制Id
          customId: "", //口岸
          price: "", //备案价格
          skuId: "", //商品id
          productName: "",
          taxRecordId: "" //税则id
        }
      },
      rules: {
        customId: [
          {
            type: "number",
            required: true,
            message: i18n.t("portProduct.customIdRequired"),
            trigger: "blur"
          }
        ],
        taxRecordId: [
          {
            type: "number",
            required: true,
            message: i18n.t("portProduct.taxRecordIdRequired"),
            trigger: "blur"
          }
        ],
        productName: [
          {
            required: true,
            message: i18n.t("portProduct.productNameRequired"),
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: i18n.t("portProduct.priceRequired"),
            trigger: "blur"
          }
        ]
      },
      tableShow: false, //控制选择商品表格显示隐藏
      modal: "", //用来区分是编辑弹窗还是新增弹窗
      customs: [], // 备案口岸
      taxRecords: [], // 备案税则
      currencyList: [], //币制
      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },
  created() {
    this.loadData();
    this.getTaxRecord();
    this.getCurrency();
    this.getcustoms();
  },
  methods: {
    search() {
      this.pagination.current = 1;
      this.loadData();
    },
    reset() {
      this.form = {
        customId: "",
        barCode: ""
      };
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
    edit(params) {
      this.editModal.customs = {
        id: params.id,
        currencyId: params.currencyId, //币制Id
        customId: params.customId, //口岸
        price: params.price, //备案价格
        skuId: params.skuId, //商品id
        productName: params.productBarCode + "-" + params.productName, //商品名称
        taxRecordId: params.taxRecordId //税则id
      };
    },
    //提交修改数据
    update() {
      const data = {
        id: this.editModal.customs.id,
        currencyId: this.editModal.customs.currencyId, //币制Id
        customId: this.editModal.customs.customId, //口岸
        price: this.editModal.customs.price, //备案价格
        skuId: this.editModal.customs.skuId, //商品id
        taxRecordId: this.editModal.customs.taxRecordId
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
              this.$Message.error(error.message);
            });
        }
      });
    },
    addModalShow() {
      this.addModal.show = true;
      this.addModal.customs = {
        //初始化数据
        currencyId: "", //币制Id
        customId: "", //口岸
        price: "", //备案价格
        skuId: "", //商品id
        productName: "",
        taxRecordId: "" //税则id
      };
    },
    add() {
      const data = {
        currencyId: this.addModal.customs.currencyId, //币制Id
        customId: this.addModal.customs.customId, //口岸
        price: this.addModal.customs.price, //备案价格
        skuId: this.addModal.customs.skuId, //商品id
        taxRecordId: this.addModal.customs.taxRecordId
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
              this.$Message.error(error.message);
            });
        }
      });
    },
    searchProduct() {
      this.modal = "edit";
      this.tableShow = true;
    },
    addProduct() {
      this.modal = "add";
      this.tableShow = true;
    },
    // 备案税则
    getTaxRecord() {
      taxRecord().then(response => {
        this.taxRecords = response.data.map(item => {
          item.value = item.id;
          item.label = item.name;
          return item;
        });
      });
    },
    // 币制
    getCurrency() {
      currency().then(response => {
        this.currencyList = response.data.map(item => {
          item.value = item.id;
          item.label = item.name;
          return item;
        });
      });
    },
    // 获取备案口岸列表数据
    getcustoms() {
      customs().then(response => {
        this.customs = response.data.map(item => {
          item.value = item.id;
          item.label = item.name;
          return item;
        });
      });
    },
    success(val) {
      if (val.modal === "edit") {
        this.editModal.customs.productName =
          val.selectData.barCode + "-" + val.selectData.name; //更新备案商品 条码+名称
        this.editModal.customs.skuId = val.selectData.skuId;
        this.tableShow = false;
      } else {
        this.addModal.customs.productName =
          val.selectData.barCode + "-" + val.selectData.name; //更新备案商品 条码+名称
        this.addModal.customs.skuId = val.selectData.skuId;
        console.log(this.addModal);
        this.tableShow = false;
      }
    }
  }
};
</script>
