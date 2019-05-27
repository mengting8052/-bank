<template>
  <Modal v-model="show" :title="title" @on-visible-change="visibleChange">
    <Form inline :model="form.data" :rules="form.rules" :label-width="80" ref="modal-form">
      <FormItem :label="$t('product.category.name')" prop="name">
        <Input type="text" v-model="form.data.name" style="width: 300px"></Input>
      </FormItem>
      <br>
      <FormItem :label="$t('product.category.sort')" prop="sort">
        <Input type="text" v-model.number="form.data.sort" style="width: 300px"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="createOrUpdate" :loading="btnLoading">{{$t("common.confirm")}}</Button>
    </div>
  </Modal>
</template>

<script>
const CATEGORY_OBJ = Object.freeze({
  id: "",
  name: "",
  sort: 0
})

import { addFirst, getFirst, updateFirst } from "../../../../api/category";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: [String, Number],
      default: ""
    }
  },

  data() {
    return {
      show: this.visible,
      btnLoading: false,
      form: {
        data: Object.assign({}, CATEGORY_OBJ),
        rules: {
          name: [{ required: true, message: i18n.t("product.category.nameRequired"), trigger: "blur" }],
          sort: [{ type: "number", message: i18n.t("product.category.sortRequried"), trigger: "blur" }]
        }
      }
    };
  },

  computed: {
    title() {
      return this.categoryId ? i18n.t("product.category.editParentCategory") : i18n.t("product.category.createParentCategory")
    }
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
    visibleChange(visible) {
      if(visible) {
        this.form.data = Object.assign({}, CATEGORY_OBJ, { id: this.categoryId })
        this.categoryId && this.initCategory()
      }
    },

    initCategory() {
      getFirst(this.categoryId).then(response => {
        this.form.data = Object.assign({}, this.form.data, response.data)
      })
    },

    createOrUpdate() {
      const requestMethod = this.form.data.id ? updateFirst : addFirst
      this.$refs["modal-form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          requestMethod(this.form.data)
            .then(response => {
              this.$Message.success(i18n.t("common.success"));
              this.btnLoading = false;
              this.show = false;
              this.$emit("on-success");
              this.$refs["modal-form"].resetFields();
            })
            .catch(error => {
              this.$Message.error(error.message);
              this.btnLoading = false;
            });
        }
      });
    },
  }
};
</script>

