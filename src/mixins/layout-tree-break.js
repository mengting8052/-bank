export const layout_tree_break = {
  data() {
    return {
      tableHeight: 0,
      treeHeight: 0,
    };
  },
  computed: {
    $layoutTree() {
      return {
        tableHeight: this.tableHeight,
        treeStyle: {height: `${this.treeHeight}px`, overflowY: "scroll"},
      };
    },
  },
  methods: {
    _updateDimensions() {
      const clientHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

      const headerHeight = document.querySelector(".gvt-header")
        .offsetHeight;

      const titleWrapperHeight = document.querySelector(".title-wrapper").offsetHeight;

      const searchWrapperHeight = document.querySelector(".search-wrapper").offsetHeight;

      const dataTitleHeight = document.querySelector(".data-title").offsetHeight;

      const dataTableBtnsHeight = document.querySelector(".data-table-btns").offsetHeight;

      const dataPageHeight = document.querySelector(".data-page").offsetHeight;

      // .gvt-content padding 10*2
      // .gvt-layout-tree padding 20*2
      // .search-wrapper margin-bottom 10
      // .data-table-wrapper padding 10*2
      // .data-table margin 10*2
      // border 4*1
      const fixed = 20 + 40 + 10 + 20 + 20 + 4;

      let tableHeight = clientHeight - (headerHeight + titleWrapperHeight + searchWrapperHeight + dataTitleHeight + dataTableBtnsHeight +
        dataPageHeight) - fixed;

      tableHeight = tableHeight >= 500 ? tableHeight : 500;

      this.tableHeight = tableHeight;

      // .gvt-data margin 10
      // 其实我就这么随意加个值而已...
      this.treeHeight = tableHeight + dataTableBtnsHeight + 10;
    }

  },
  mounted() {
    this.$nextTick(() => {
      this._updateDimensions();
      window.addEventListener('resize', this._updateDimensions, {
        'passive': true
      });
    });
  },
  destroyed() {
    window.removeEventListener('resize', this._updateDimensions);
  },
};
