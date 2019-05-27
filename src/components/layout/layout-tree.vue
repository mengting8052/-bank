<template>
  <div class="gvt-layout-tree">
    <div class="title-wrapper" v-show="!disTitle">
      <slot name='title'>
      </slot>
    </div>
    <div class="search-wrapper" :class="{'border-top-fixed': disTitle}">
      <slot name="search">
      </slot>
    </div>

    <div class="data-wrapper">

      <div class="data-title">
        <slot name="data-title">
        </slot>
      </div>

      <div class="data-content">
        <Row>
          <Col 
            class-name="data-tree-wrapper"
            :md="8"
            :lg="4">
          <div class="data-tree" :style="$layoutTree.treeStyle">
            <slot name="data-tree">
            </slot>
          </div>
          <div class="data-tree-btns">
            <slot name="data-tree-btns">
            </slot>
          </div>
          </Col>

          <Col 
            class-name="data-table-wrapper"
            :md="16"
            :lg="20">
          <div class="data-table-btns">
            <slot name="data-table-btns">
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
          </Col>
        </Row>
      </div>
    </div>

    <slot></slot>

  </div>
</template>

<script>
import {layout_tree_break} from "../../mixins/layout-tree-break";
export default {
  props:{
    disTitle: [Boolean]
  },
  name: "gvt-layout-tree",

  mixins: [layout_tree_break],

  methods: {}
};
</script>
