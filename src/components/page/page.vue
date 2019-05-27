<template>
  <div>
    <Select v-model="pagination.pageSize" @on-change="handlePageSizeChange" class="gvt-page-size">
      <Option v-for="item in pagination.pageSizeOpts" :value="item" :key="item">
        {{ $t('common.pagination', { pageSize: item }) }}
      </Option>
    </Select>
    <Page 
      class="gvt-page"
      :current.sync="pagination.current" 
      :total="pagination.total" 
      :page-size="pagination.pageSize" 
      @on-change="handlePageChange"
      show-elevator 
      show-total>
    </Page>
  </div>
</template>

<script>
import { PAGE_PARAMS } from "../../constants";
export default {
  name: "gvt-page",

  props: {
    pagination: {
      type: Object,
      default: () => {
        return PAGE_PARAMS;
      }
    }
  },

  methods: {
    handlePageSizeChange() {
      this.$emit("on-page-size-change");
    },

    handlePageChange() {
      this.$emit("on-page-change");
    }
  }
};
</script>
