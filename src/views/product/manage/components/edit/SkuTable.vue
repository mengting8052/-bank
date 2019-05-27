<template>
  <div>
    <Table :data="table.data" :columns="table.cols"></Table>
  </div>
</template>

<script>
export default {

  props: {
    columns: [Array],
    data: [Array],
  },

  data() {
    return {
      table: {
        data: [],
        cols: []
      }
    }
  },

  watch: {
    columns(val) {
      this.table.cols = val;
    },
    data(val) {
      this.table.data = val;
    },
  }

};
</script>

