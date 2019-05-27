<template>
  <hero-error code="500" :locale="locale"></hero-error>
</template>

<script>
import Lang from "../../utils/lang"

export default {
  data() {
    return {
      locale: Lang.getLang()
    }
  }
};
</script>
