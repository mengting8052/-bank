<template>
  <Modal v-model="show" :title="$t('product.attribute.createPPGroup')">
    <Form inline :model="form.data" :rules="form.rules" :label-width="80" ref="modal-form">
      <FormItem :label="$t('product.attribute.name')" prop="name">
        <Input type="text" v-model="form.data.name" style="width: 300px"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirm" :loading="btnLoading">{{$t("common.confirm")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { add } from "../../../../api/property";
import { i18n } from "../../../../setup/i18n-setup.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data(){
    return {
      show: this.visible,
      btnLoading: false,
      form: {
        data: {
          name: ""
        },
        rules: {
          name: [
            {required: true, message: i18n.t("product.attribute.nameRequired"), trigger: "blur"}
          ]
        }
      }
    }
  },

  watch: {
    visible(val){
      this.show = val;
      if(this.show) {
        this.$refs["modal-form"].resetFields();
      }
    },
    show(val){
      this.$emit("update:visible", val);
    }
  },

  methods: {
    confirm() {
      this.$refs["modal-form"].validate((valid) => {
        if(valid) {
          this.btnLoading = true;
          add(this.form.data).then(response => {
            this.$Message.success(i18n.t("common.success"));
            this.show = false;
            this.$emit("success");
            this.$refs["modal-form"].resetFields();
            this.btnLoading = false;
          }).catch(error => {
            this.$Message.error(error.message);
            this.btnLoading = false;
          });
        }
      })
    }
  }

}
</script>

