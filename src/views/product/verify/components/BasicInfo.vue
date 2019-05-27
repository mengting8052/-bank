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
      <FormItem :label="$t('product.basicInfo.brandId')" :error="$brandError">
        <Select style="width: 147px" transfer v-model="form.brandId" filterable>
          <Option v-for="(item, index) in brands" :key="item.id + '.' + index" :value="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('product.basicInfo.category')" :error="$categoryError">
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
import { list as brandList } from "../../../../api/brand";
import { listTree as categoryList } from "../../../../api/category";
import { splitPackage } from "../../../../api/tenant";
import ProductImage from "../../manage/components/ProductImage";
import { i18n } from "../../../../setup/i18n-setup.js"

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
        componentContent: this.basicInfo.componentContent,
        // 品牌名称
        brandName: this.basicInfo.brandName,
        // 一级分类名称
        bigClassName: this.basicInfo.bigClassName,
        // 二级分类名称
        smallClassName: this.basicInfo.smallClassName
      },

      brands: [],

      categories: [],

      category: [],

      splits: [],

      split: []
    };
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
        this.categories.push({
          value: "none",
          label: val.bigClassName,
          children: [
            {
              value: "none",
              label: val.smallClassName
            }
          ]
        });
        this.category = ["none", "none"];
      }
      if(this.form.ptId) {
        this.splits.forEach(item => {
          const found = item.children.find(v => v.value == this.form.ptId);
          if(found) {
            this.split = [item.value, found.value];
            return;
          }
        })
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
      var classId;
      if (val && val.length) {
        classId = val[1];
      } else {
        classId = "";
      }
      this.form.classId = classId;
      if (classId !== "none") {
        this.$bus.emit("category-change-property", classId);
      }
    },
    "form.classId": {
      handler: function(val) {
        this.categories.forEach(item => {
          const found = item.children.find(v => {
            return v.value == val;
          })
          if (found) this.category = [item.value, found.value];
          return;
        });
      }
    }
  },

  computed: {
    $brandError() {
      if (this.form.brandId === "none") {
        return i18n.t("product.basicInfo.brandNeedToCreate")
      } else {
        return "";
      }
    },

    $categoryError() {
      if (this.category.indexOf("none") !== -1) {
        return i18n.t("product.basicInfo.categoryNeedToCreate")
      } else {
        return "";
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
      let classId;
      if (val && val.length) {
        classId = val[1];
      } else {
        classId = "";
      }
      this.form.classId = classId;
      if (classId !== "none") {
        this.$bus.emit("category-change", classId);
      }
    },

    getData() {
      return Object.assign({}, this.form);
    },

    fetchBrands() {
      brandList().then(response => {
        // 此处千万不要 this.brands = response.data
        // 因为在 watch 中会对 this.brands 进行一次初始化
        // 初始化后, brands 可能会有值
        response.data.forEach(item => {
          this.brands.push(item);
        });
      });
    },

    fetchCategories() {
      categoryList().then(response => {
        // 通品牌处理类似
        response.data.forEach(item => {
          this.categories.push(item);
        });
        this.categories.forEach(item => {
          const found = item.children.find(v => {
            return v.value == this.form.classId;
          })
          if (found) this.category = [item.value, found.value];
          return;
        });
      });
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
    }
  }
};
</script>
