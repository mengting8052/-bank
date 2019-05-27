<template>
  <Modal v-model="show" :title="$t('product.attribute.editPPValue')" @on-visible-change="visibleChange">
    <Form inline :model="form.data" :rules="form.rules" :label-width="80" ref="modal-form">
      <FormItem :label="$t('product.attribute.code')" prop="code">
        <Input type="text" v-model="form.data.code" style="width: 300px" readonly></Input>
      </FormItem>
      <br>
      <FormItem :label="$t('product.attribute.name')" prop="name">
        <Input type="text" v-model="form.data.name" style="width: 300px"></Input>
      </FormItem>
      <FormItem :label="$t('product.attribute.description')" prop="description">
        <Input type="text" v-model="form.data.description" style="width: 300px"></Input>
      </FormItem>
      <FormItem>
        <Checkbox v-model="form.data.status">{{$t("product.attribute.status")}}</Checkbox>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="show = !show">{{$t("common.cancel")}}</Button>
      <Button type="primary" @click="confirm" :loading="btnLoading">{{$t("common.confirm")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { get, update } from "../../../../api/property-detail";
import { i18n } from "../../../../setup/i18n-setup.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    propertyDetailId: [Number, String]
  },

  data(){
    return {
      show: this.visible,
      btnLoading: false,
      form: {
        data: {
          id: "",
          code: "",
          name: "",
          description: "",
          status: true
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
          update(this.form.data).then(response => {
            this.$Message.success(i18n.t("common.success"));
            this.show = false;
            this.$emit("success");
            this.btnLoading = false;
          }).catch(error => {
            this.$Message.error(error.message);
            this.btnLoading = false;
          });
        }
      })
    },

    visibleChange(val){
      if(val){
        get(this.propertyDetailId).then(response => {
          this.form.data = response.data;
        }).catch()
      }
    }
  }

}
</script>

