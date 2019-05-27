<template>
  <div style="padding: 10px">
    <Form :label-width="120"  :model="form.data">
      <FormItem :label="$t('filingConfig.bcPersonageYearAmount')" prop="bcPersonageYearAmount">
        <InputNumber :min="0" v-model="form.data.bcPersonageYearAmount" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('filingConfig.bcSinglePacketAmount')" prop="bcSinglePacketAmount">
        <InputNumber :min="0" v-model="form.data.bcSinglePacketAmount" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('filingConfig.ccMinRateAmount')" prop="ccMinRateAmount">
        <InputNumber :min="0" v-model="form.data.ccMinRateAmount" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('filingConfig.ccSinglePacketAmount')" prop="ccSinglePacketAmount">
        <InputNumber :min="0" v-model="form.data.ccSinglePacketAmount" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('filingConfig.transportRate')" prop="transportRate">
        <InputNumber :min="0" v-model="form.data.transportRate" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="btnLoading" @click="confirm">{{ $t("common.save") }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {saveOrUpdate, selectById} from "../../../api/filling-config.js"
import { i18n } from "../../../setup/i18n-setup.js";

export default {
  data() {
    return {
      btnLoading: false,

      form: {
        data: {
          bcPersonageYearAmount: 0,
          bcSinglePacketAmount: 0,
          ccMinRateAmount: 0,
          ccSinglePacketAmount: 0,
          transportRate: 0
        }
      }
    };
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData() {
      selectById().then(response => {
        this.form.data = Object.assign({}, this.form.data, response.data)
      })
    },

    confirm() {
      this.btnLoading = true
      const params = Object.assign({}, this.form.data, {id: 1})
      saveOrUpdate(params).then(response => {
        this.btnLoading = false
        this.$Message.success(i18n.t("common.success"))
      }).catch(error => {
        this.$Message.error(error.message)
        this.btnLoading = false
      })
    }
  }
};
</script>

