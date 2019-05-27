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
          <Option v-for="(item, index) in brands" :key="item.id + '.' + index" :value="item.id">{{ item.name }}</Option>
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
import {
  listTree as categoryList,
  listTreeForTenantLeadIn
} from "../../../../../api/category";
import { splitPackage } from "../../../../../api/tenant";
import { hscodeList } from "../../../../../api/tax";
import ProductImage from "../ProductImage";

export default {
  name: "basic-info",

  components: { ProductImage },

  props: {
    basicInfo: [Object]
  },

  data() {
    return {
      form: {
        // 商品图片
        image: this.basicInfo.image || "",
        // 商品名称
        name: this.basicInfo.name,
        // 商品简称
        shortName: this.basicInfo.shortName,
        // 商品品牌
        brandId: this.basicInfo.brandId,
        // 商品分类
        classId: this.basicInfo.classId,
        // 原产地
        origin: this.basicInfo.origin,
        // 拆单分类
        ptId: this.basicInfo.ptId,
        // 成分含量
        componentContent: this.basicInfo.componentContent
      },

      brands: [],

      categories: [],

      category: [],

      splits: [],

      split: []
    };
  },

  computed: {
    classId() {
      return this.form.classId;
    }
  },

  watch: {
    basicInfo(val) {
      this.form = val;
      // 初始化 商品品牌
      if (!val.brandId) {
        this.brands.push({ id: "none", name: val.brandName });
        this.form.brandId = "none";
      }
      // 初始化 商品分类
      if (!val.classId) {
        this.category = ["none", "none"];
      }
      if (this.form.ptId) {
        this.splits.forEach(item => {
          const found = item.children.find(v => v.value == this.form.ptId);
          if (found) {
            this.split = [item.value, found.value];
            return;
          }
        });
      }
    },

    split(val) {
      if (val) {
        this.form.ptId = val[1];
      } else {
        this.form.ptId = "";
      }
    },

    category(val) {
      if (val && val.length) {
        this.form.classId = val[1];
      } else {
        this.form.classId = "";
      }
      this.$bus.emit("category-change-property", this.form.classId);
    },

    classId(val) {
      if (this.categories.length == 0) {
        return;
      } else {
        this.category = [];
        this.categories.map(item => {
          let found = item.children.find(v => v.value == val);
          if (found) {
            this.category.push(item.value);
            this.category.push(val);
          }
        });
      }
    }
  },

  mounted() {
    this.fetchSplits();
    this.fetchBrands();
    this.fetchCategories();
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
      let fatherClassName;
      let className;
      if (this.category.length == 2) {
        this.categories.every(item => {
          if (item.value == this.category[0]) {
            fatherClassName = item.label;
            item.children.every(ii => {
              if (ii.value == this.category[1]) {
                className = ii.label;
                return false;
              }
              return true;
            });
            return false;
          }
          return true;
        });
      }
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
          fatherClassName,
          // 商品分类
          classId: this.form.classId,
          className,
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
            if (this.form.ptId == val.ptid) {
              this.split = [item.sortName, val.ptid];
            }
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
      brandList().then(response => {
        this.brands.push(...response.data);
      });
    },

    fetchCategories() {
      if (this.$route.query.gvt) {
        const params = {
          gvtProductId: this.$route.query.id
        };
        listTreeForTenantLeadIn(params).then(response => {
          response.data.forEach(item => {
            let obj = {};
            obj.value = item.value || "none";
            obj.label = item.label;
            obj.children = [];
            item.children.map(v => {
              obj.children.push({
                value: v.value || "none",
                label: v.label
              });
            });
            this.categories.push(obj);
          });
        });
      } else {
        categoryList().then(response => {
          this.categories = response.data;
          this.categories.map(item => {
            let found = item.children.find(v => v.value == this.form.classId);
            if (found) {
              this.category.push(item.value);
              this.category.push(this.form.classId);
            }
          });
        });
      }
    }
  }
};
</script>
