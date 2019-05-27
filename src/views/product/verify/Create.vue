<template>
  <div>
    商品创建
  </div>
</template>

<script>
export default {
  created(){
    const hash = window.location.hash;
    var current = "#/product/verify/";
    const reg = new RegExp(`^(${current})`);
    console.log(reg);
    const valid = reg.test(hash);
    console.log(valid);
  }
};
</script>

