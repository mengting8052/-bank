<template>
  <gvt-layout>
    <template slot="title">{{ $t("filingPort.portSearch") }}</template>

    <template slot="search">
      <Form inline :label-width="80">
        <FormItem prop="portCode" :label="$t('filingPort.portCode')">
          <Input v-model="form.portCode"></Input>
        </FormItem>
        <FormItem prop="portName" :label="$t('filingPort.portName')">
          <Input v-model="form.portName"></Input>
        </FormItem>
        <FormItem prop="portPhone" :label="$t('filingPort.portPhone')">
          <Input v-model="form.portPhone"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">{{ $t("common.search") }}</Button>
          <Button type="ghost" @click="reset" style="margin-left:8px">{{ $t("common.reset") }}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="btn-groups">
      <Button type="primary" @click="add">{{ $t("filingPort.portCreate") }}</Button>
    </template>

    <template slot="data-title" style="display:none"></template>

    <template slot="data-table">
      <Table
        :columns="table.cols"
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
      <Modal :title="$t('filingPort.portCreate')" v-model="addModal.show">
        <Form
          ref="addForm"
          inline
          :label-width="80"
          :rules="addModal.rules"
          :model="addModal.filing"
        >
          <FormItem :label="$t('filingPort.portCode')" prop="code">
            <Input v-model="addModal.filing.code" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portName')" prop="name">
            <Input v-model="addModal.filing.name" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portPhone')" prop="phone">
            <Input v-model="addModal.filing.phone" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portAddress')" prop="regions">
            <Cascader
              :data="regions"
              change-on-select
              style="width:400px"
              v-model="addModal.filing.regions"
            ></Cascader>
          </FormItem>
          <FormItem prop="address">
            <Input type="textarea" v-model="addModal.filing.address" style="width:400px"></Input>
          </FormItem>
        </Form>
        <template slot="footer">
          <Button type="ghost" @click="cancelAddModel">{{ $t("common.cancel") }}</Button>
          <Button type="primary" @click="addModalSubmit">{{ $t("common.confirm") }}</Button>
        </template>
      </Modal>

      <Modal :title="$t('filingPort.portEdit')" v-model="editModal.show">
        <Form
          ref="editForm"
          inline
          :label-width="80"
          :rules="editModal.rules"
          :model="editModal.filing"
        >
          <FormItem :label="$t('filingPort.portCode')" prop="code">
            <Input v-model="editModal.filing.code" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portName')" prop="name">
            <Input v-model="editModal.filing.name" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portPhone')" prop="phone">
            <Input v-model="editModal.filing.phone" style="width:400px"></Input>
          </FormItem>
          <FormItem :label="$t('filingPort.portAddress')" prop="regions">
            <Cascader
              :data="regions"
              change-on-select
              style="width:400px"
              v-model="editModal.filing.regions"
            ></Cascader>
          </FormItem>
          <FormItem prop="address">
            <Input type="textarea" v-model="editModal.filing.address" style="width:400px"></Input>
          </FormItem>
        </Form>
        <template slot="footer">
          <Button type="ghost" @click="cancelEditModel">{{ $t("common.cancel") }}</Button>
          <Button type="primary" @click="update">{{ $t("common.confirm") }}</Button>
        </template>
      </Modal>
    </template>
  </gvt-layout>
</template>
<script>
import { layout_break } from "../../../mixins/layout";
import { PAGE_PARAMS } from "../../../constants";
import { listPage, region, add, remove, update } from "../../../api/filling.js";
import { i18n } from "../../../setup/i18n-setup.js";

export default {
  mixins: [layout_break],
  data() {
    return {
      form: {
        portCode: "",
        portName: "",
        portPhone: ""
      },
      table: {
        loading: false,
        cols: [
          {
            title: "#",
            type: "index"
          },
          {
            title: i18n.t("filingPort.portCode"),
            key: "code"
          },
          {
            title: i18n.t("filingPort.portName"),
            key: "name"
          },
          {
            title: i18n.t("filingPort.portPhone"),
            key: "phone"
          },
          {
            title: i18n.t("filingPort.portAddress"),
            key: "address"
          },
          {
            title: i18n.t("common.createUser"),
            key: "createUser"
          },
          {
            title: i18n.t("common.createTime"),
            key: "createTime",
            render: (h, params) => {
              return h(
                "span",
                this.$options.filters.timeFormat(params.row.createTime, false)
              );
            }
          },
          {
            title: i18n.t("common.modifyUser"),
            key: "modifyUser"
          },
          {
            title: i18n.t("common.modifyTime"),
            key: "modifyTime",
            render: (h, params) => {
              if (params.row.modifyTime) {
                return h(
                  "span",
                  this.$options.filters.timeFormat(params.row.modifyTime, false)
                );
              }
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
                      this.edit(params.row);
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
        ],
        data: []
      },
      pagination: Object.assign({}, PAGE_PARAMS),
      addModal: {
        loading: false,
        show: false,
        filing: {
          code: "",
          name: "",
          phone: "",
          address: "",
          regions: [],
          address: ""
        },
        rules: {
          code: [
            {
              pattern: /^\d{4}$/,
              message: i18n.t("filingPort.codeRequired"),
              trigger: "blur",
              required: true
            }
          ],
          name: [
            {
              required: true,
              message: i18n.t("filingPort.nameRequired"),
              trigger: "blur"
            }
          ],
          phone: [
            {
              required: true,
              message: i18n.t("filingPort.phoneRequired"),
              trigger: "blur"
            },
            {
              pattern: /^[0-9]*$/,
              required: true,
              message: i18n.t("filingPort.phoneRule"),
              trigger: "blur"
            }
          ],
          regions: [
            {
              required: true,
              message: i18n.t("filingPort.regionsRequired"),
              trigger: "blur",
              type: "array"
            }
          ],
          address: [
            {
              required: true,
              message: i18n.t("filingPort.addressRequired"),
              trigger: "blur"
            }
          ]
        }
      },
      editModal: {
        loading: false,
        show: false,
        filing: {
          id: "",
          code: "",
          name: "",
          phone: "",
          address: "",
          regions: [],
          address: ""
        },
        rules: {
          code: [
            {
              pattern: /^\d{4}$/,
              message: i18n.t("filingPort.codeRequired"),
              trigger: "blur",
              required: true
            }
          ],
          name: [
            {
              required: true,
              message: i18n.t("filingPort.nameRequired"),
              trigger: "blur"
            }
          ],
          phone: [
            {
              required: true,
              message: i18n.t("filingPort.phoneRequired"),
              trigger: "blur"
            },
            {
              pattern: /^[0-9]*$/,
              required: true,
              message: i18n.t("filingPort.phoneRule"),
              trigger: "blur"
            }
          ],
          regions: [
            {
              required: true,
              message: i18n.t("filingPort.regionsRequired"),
              trigger: "blur",
              type: "array"
            }
          ],
          address: [
            {
              required: true,
              message: i18n.t("filingPort.addressRequired"),
              trigger: "blur"
            }
          ]
        }
      },

      regions: []
    };
  },
  created() {
    this.loadData();
    this.getRegion();
  },
  methods: {
    search() {
      this.pagination.current = 1;
      this.loadData();
    },
    reset() {
      this.form = {
        portCode: "",
        portName: "",
        portPhone: ""
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
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.table.loading = false;
        })
        .catch(error => {
          this.table.loading = false;
        });
    },
    add() {
      this.addModal.show = true;
    },
    getRegion() {
      region().then(response => {
        this.regions = this.iterativeFormat(response.data);
      });
    },
    addModalSubmit() {
      const data = {
        code: this.addModal.filing.code,
        name: this.addModal.filing.name,
        phone: this.addModal.filing.phone,
        city: this.addModal.filing.regions[2],
        province: this.addModal.filing.regions[1],
        country: this.addModal.filing.regions[0],
        area: this.addModal.filing.regions[3],
        address: this.addModal.filing.address
      };
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addModal.loading = true;
          add(data)
            .then(response => {
              this.$Message.success(i18n.t("common.sucess"));
              this.addModal.loading = false;
              this.addModal.show = false;
              this.$refs["addForm"].resetFields();
              this.loadData();
            })
            .catch(error => {
              this.$Message.error(error.message);
            });
        }
      });
    },
    edit(data) {
      this.editModal.show = true;
      this.editModal.filing.id = data.id;
      this.editModal.filing.code = data.code;
      this.editModal.filing.name = data.name;
      this.editModal.filing.phone = data.phone;
      data.country === "00000002"
        ? (this.editModal.filing.regions = [data.country, data.province])
        : (this.editModal.filing.regions = [
            data.country,
            data.province,
            data.city,
            data.area
          ]);
      this.editModal.filing.address = data.address;
    },
    update() {
      const data = {
        id: this.editModal.filing.id,
        code: this.editModal.filing.code,
        name: this.editModal.filing.name,
        phone: this.editModal.filing.phone,
        city: this.editModal.filing.regions[2],
        province: this.editModal.filing.regions[1],
        country: this.editModal.filing.regions[0],
        area: this.editModal.filing.regions[3],
        address: this.editModal.filing.address
      };
      this.$refs["editForm"].validate(valid => {
        this.editModal.loading = true;
        if (valid) {
          update(data)
            .then(response => {
              this.editModal.loading = false;
              this.$Message.success(i18n.t("common.success"));
              this.editModal.show = false;
              this.loadData();
            })
            .catch(error => {
              this.$Message.error(error.message);
            });
        }
      });
    },
    iterativeFormat(arrays) {
      //迭代格式化
      if (!arrays || arrays.length === 0) {
        return [];
      }
      var result = [];
      var stack = [];
      arrays.every(item => {
        if (item.children && item.children.length > 0) {
          var formatObj = {
            value: item.value,
            label: item.label,
            children: []
          };
          result.push(formatObj);
          stack.push({
            parentFormatObj: null,
            formatObj: formatObj,
            originalObj: item
          });
        } else {
          var formatObj = {
            value: item.value,
            label: item.label
          };
          result.push(formatObj);
          stack.push({
            parentFormatObj: null,
            formatObj: formatObj,
            originalObj: item
          });
        }
        return true;
      });
      var tmpNode;
      while (stack.length > 0) {
        tmpNode = stack.pop();
        var node = {
          value: tmpNode.originalObj.value,
          label: tmpNode.originalObj.label
        };
        if (
          tmpNode.originalObj.children &&
          tmpNode.originalObj.children.length > 0
        ) {
          node.children = [];
          for (
            var index = 0;
            index < tmpNode.originalObj.children.length;
            index++
          ) {
            stack.push({
              parentFormatObj: tmpNode.formatObj,
              formatObj: node,
              originalObj: tmpNode.originalObj.children[index]
            });
          }
        }
        if (tmpNode.parentFormatObj) {
          tmpNode.parentFormatObj.children.push(node);
        }
      }
      return result;
    },
    cancelAddModel() {
      this.addModal.show = false;
      this.$refs["addForm"].resetFields();
    },
    cancelEditModel() {
      this.editModal.show = false;
      this.$refs["editForm"].resetFields();
    }
  }
};
</script>

