<template>
  <AutoComplete v-model="query" @on-search="search(true)" style="width: 280px" transfer>
    <Scroll :on-reach-bottom="handleReachBottom" loading-text="加载中..." :distance-to-edge="-20">
      <Option v-for="item in data" :key="item.taxNum" :value="item.taxNum" :label="item.taxNum" @click.native="optionClick(item.taxNum)">{{ item.taxNum }} {{ item.productName }}</Option>
    </Scroll>
  </AutoComplete>
</template>

<script>
import { listPage } from "../../../../api/taxRate";
import { typeOf, throttle } from "../../../../utils/helper";

export default {
  name: "rate-tax-num-select",

  props: {
    value: String
  },

  data() {
    return {
      query: this.value,
      data: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        pageTotal: 1
      }
    };
  },

  watch: {
    value(val) {
      this.query = val;
    }
  },

  methods: {
    handleReachBottom() {
      return new Promise(resolve => {
        this.pagination.pageNum++;
        if(this.pagination.pageNum > this.pagination.pageTotal) {
          return resolve();
        }
        const params = Object.assign(
          {},
          {
            key: this.query,
            pageNum: this.pagination.pageNum,
            pageSize: this.pagination.pageSize
          }
        );
        listPage(params)
          .then(response => {
            this.data.push(...response.data.list);
            resolve();
          })
          .catch(error => {
            resolve();
          });
      });
    },

    search: throttle(function(reload = false) {
      this.loadData(reload)
    }, 800),

    optionClick(taxNum) {
      this.$emit("input", taxNum)
    },

    loadData(reload = false) {
      reload && (this.pagination.pageNum = 1)
      const params = Object.assign(
        {},
        {
          key: this.query,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }
      );
      listPage(params)
        .then(response => {
          this.data = response.data.list
          this.pagination.pageTotal = response.data.pages
        })
        .catch(() => {
          this.data = [];
        });
    },
  }
};
</script>

