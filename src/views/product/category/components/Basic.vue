<template>
  <div class="form-wrapper">
    <Form inline :label-width="80" :model="form.data" :rules="form.rules">
      <FormItem :label="$t('product.category.parentName')" prop="parentId">
        <Select style="width: 147px" v-model="form.data.parentId">
          <Option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('product.category.name')" prop="name">
        <Input type="text" v-model="form.data.name"></Input>
      </FormItem>
      <FormItem :label="$t('product.category.sort')" prop="sort">
        <Input type="text" v-model.number="form.data.sort"></Input>
      </FormItem>
      <FormItem :label="$t('product.category.imageUrl')">
        <upload v-model="form.data.imageUrl"></upload>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { listAllTree } from "../../../../api/category";
import upload from "../../../../components/common/uploader";
import { uploadBase64 } from "../../../../api/upload";
import { getSecond } from "../../../../api/category";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  components: { upload },

  props: {
    basic: {
      type: Object,
      default: () => ({id: "", name: "", parentId: "", imageUrl: "", sort: 0})
    }
  },

  data() {
    const validateCategory = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t("product.category.parentNameRequired")));
      } else {
        callback();
      }
    };

    return {
      categories: [],
      form: {
        data: {},
        rules: {
          name: [{ required: true, message: i18n.t("product.category.nameRequired"), trigger: "blur" }],
          sort: [
            { type: "number", message: i18n.t("product.category.sortRequried"), trigger: "blur" }
          ],
          parentId: [{ validator: validateCategory, trigger: "change" }]
        }
      }
    };
  },

  watch: {
    basic() {
      this.updateBasic()
    }
  },

  created() {
    this.updateBasic()
    this.fetchCategories();
  },

  methods: {
    updateBasic() {
      this.form.data = Object.assign({}, this.basic)
    },

    fetchCategories() {
      listAllTree().then(response => {
        response.data.map(item => {
          let obj = {
            id: item.value,
            name: item.label
          };
          this.categories.push(obj);
        });
      });
    },

    getRequestData() {
      return {
        name: this.form.data.name,
        parentId: this.form.data.parentId,
        sort: this.form.data.sort,
        imageUrl: this.form.data.imageUrl
      };
    }
  }
};
</script>

