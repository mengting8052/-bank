
export const layout_break = {
  data() {
    return {
      tableHeight: 0,
    }
  },
  computed: {
    $layout() {
      return {
        tableHeight: this.tableHeight,
      }
    }
  },
  methods: {
    updataDimensions() {
      const clientHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const headerHeight = document.querySelector('.gvt-header').offsetHeight;
      const titleWrapperHeight = document.querySelector('.title-wrapper').offsetHeight;
      const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
      const btnGroupsWrapperHeight = document.querySelector('.btn-groups-wrapper').offsetHeight;
      const dataTitle = document.querySelector(".data-title").offsetHeight;
      const dataPage = document.querySelector(".data-page").offsetHeight;
      
      let tableHeight = clientHeight - (headerHeight + titleWrapperHeight + searchWrapperHeight + btnGroupsWrapperHeight + dataTitle + dataPage) - 20 - 2;
      tableHeight = tableHeight >= 500 ? tableHeight : 500;
      this.tableHeight = tableHeight;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updataDimensions();
      window.addEventListener('resize', this.updataDimensions(), {
        'passive': true
      })
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.updataDimensions);
  },
}