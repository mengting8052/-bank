<template>
  <div class="gvt-layout">
    <div class="title-wrapper">
      <slot name="title">
      </slot>
    </div> 
    <div class="search-wrapper">
      <slot name="search">
      </slot>
    </div>
    <div class="btn-groups-wrapper" v-show="!disBtnGroups">
      <slot name="btn-groups">
      </slot>
    </div>
    <div class="data-wrapper">
      <div class="data-title">
        <slot name="data-title">
        </slot>
      </div>
      <div class="data-table">
        <slot name="data-table">
        </slot>
      </div>
      <div class="data-page">
        <slot name="data-page">
        </slot>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "gvt-layout",
  
  props: {
    // 隐藏 div.btn-groups-wrapper
    disBtnGroups: [Boolean]
  }
}
</script>

