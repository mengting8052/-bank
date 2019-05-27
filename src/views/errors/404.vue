<template>
  <hero-error code="404" :locale="locale"></hero-error>
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
