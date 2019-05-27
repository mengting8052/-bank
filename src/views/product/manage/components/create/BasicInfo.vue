<template>
  <div>
    <h2>{{$t("product.basicInfo.title")}}</h2>
    <br>
    <Form inline :label-width="80">
      <FormItem :label="$t('product.basicInfo.name')">
        <Input type="text" v-model="form.name"></Input>
      </FormItem>
      <FormItem :label="$t('product.basicInfo.shortName')">
        <Input type="text" v-model="form.shortName"></Input>
      </FormItem>
      <br>
      <FormItem :label="$t('product.basicInfo.brandId')">
        <Select style="width: 147px" transfer v-model="form.brandId" filterable>
          <Option v-for="item in brands" :key="item.id" :value="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('product.basicInfo.category')">
        <Cascader :data="categories" transfer :value="category" filterable @on-change="categoryChange"></Cascader>
      </FormItem>
      <FormItem :label="$t('product.basicInfo.split')">
        <Cascader :data="splits" transfer v-model="split" transfer filterable></Cascader>
      </FormItem>
      <br>
      <FormItem :label="$t('product.basicInfo.origin')">
        <Input type="text" v-model="form.origin" :maxlength="50"></Input>
      </FormItem>
      <FormItem :label="$t('product.basicInfo.componentContent')">
        <Input type="text" v-model="form.componentContent"></Input>
      </FormItem>
      <br>
      <FormItem :label="$t('product.basicInfo.image')">
        <product-image v-model="form.image"></product-image>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { list as brandList } from "../../../../../api/brand";
import { listTree as categoryList } from "../../../../../api/category";
import { splitPackage } from "../../../../../api/tenant";
import ProductImage from "../ProductImage";

export default {
  name: "basic-info",

  components: { ProductImage },

  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      form: {
        // 商品图片
        image: this.basicInfo.image || "",
        // 商品名称
        name: this.basicInfo.name || "",
        // 商品简称
        shortName: "",
        // 商品品牌
        brandId: parseInt(this.basicInfo.brandId) || "",
        // 商品分类
        classId: "",
        // 原产地
        origin: "",
        // 拆单分类
        ptId: "",
        // 成分含量
        componentContent: ""
      },

      brands: [],

      categories: [],

      category: [],

      splits: [],

      split: []
    };
  },

  watch: {
    split(val) {
      if (val) {
        this.form.ptId = val[1];
      } else {
        this.form.ptId = "";
      }
    },
  },

  mounted() {
    this.fetchSplits();
    this.fetchBrands();
    this.fetchCategories();
    // hack 用以触发 category watcher
    if (this.basicInfo.category) {
      this.category = this.basicInfo.category.map(item => parseInt(item)) || [];
      if(this.category.length) {
        this.categoryChange(this.category)
      }
    }
    if (this.basicInfo.split) {
      this.split = this.basicInfo.split;
    }
  },

  methods: {
    categoryChange(val) {
      this.category = val.map(item => {
        if(item === "none") {
          return item
        } else {
          return parseInt(item)
        }
      })
      if (val && val.length) {
        this.form.classId = val[1];
      } else {
        this.form.classId = "";
      }
      this.$bus.emit("category-change", this.form.classId);
    },

    getData() {
      const brand = this.brands.find(item => item.id == this.form.brandId);
      const brandName = brand ? brand.name : "";
      return Object.assign(
        {},
        {
          image: this.form.image,
          // 商品名称
          name: this.form.name,
          // 商品简称
          shortName: this.form.shortName,
          // 商品品牌
          brandId: this.form.brandId,
          // 商品品牌名称
          brandName,
          // 商品分类
          classId: this.form.classId,
          // 原产地
          origin: this.form.origin,
          // 拆单分类
          ptId: this.form.ptId,
          // 成分含量
          componentContent: this.form.componentContent
        }
      );
    },

    fetchSplits() {
      splitPackage().then(response => {
        response.result.map(item => {
          let obj = {};
          obj.value = item.sortName;
          obj.label = item.sortName;
          obj.children = [];
          item.items.map(val => {
            obj.children.push({
              value: val.ptid,
              label: val.className
            });
          });
          this.splits.push(obj);
        });
      });
    },

    fetchBrands() {
      brandList().then(response => (this.brands = response.data));
    },

    fetchCategories() {
      categoryList().then(response => {
        response.data.map(item => {
          let obj = {};
          obj.value = item.value;
          obj.label = item.label;
          obj.children = [];
          item.children.map(v => {
            obj.children.push({
              value: v.value,
              label: v.label
            });
          });
          if (item.children && item.children.length) {
            this.categories.push(obj);
          }
        });
      });
    }
  }
};
</script>
