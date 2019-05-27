<template>
  <div>
    <Collapse>
      <Panel name="1">
        {{$t("product.skuRenderedTable.title")}}
        <template slot="content">
          <Table :data="table.data" :columns="table.cols"></Table>
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import { deepCopy } from "../../../../utils/helper";

export default {
  props: {
    columns: [Array],
    data: [Array]
  },

  data() {
    return {
      table: {
        data: [],
        cols: []
      }
    };
  },

  watch: {
    columns: {
      immediate: true,
      handler() {
        this.updateColumns();
      }
    },
    data: {
      immediate: true,
      handler() {
        this.updateData();
      }
    }
  },

  methods: {
    updateColumns() {
      this.table.cols = deepCopy(this.columns);
    },

    updateData() {
      this.table.data = deepCopy(this.data);
    }
  }
};
</script>

