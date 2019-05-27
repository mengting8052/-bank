<template>
  <div id="product-editor"></div>
</template>

<script>
import E from "wangeditor";
import { uploadBase64 as UploadImg } from "../../api/upload";
import Lang from "../../utils/lang"
import html5ImgCompress from "html5-image-compress";

export default {
  name: "product-editor",

  props: {
    value: [String]
  },

  data() {
    return {
      editor: "",
      locale: Lang.getLang()
    };
  },

  watch: {
    value(val) {
      if (val) {
        this.editor.txt.html(val);
      }
    }
  },

  mounted() {
    this.editor = new E("#product-editor");
    // AUTO DEBUG MODE
    this.editor.customConfig.debug =
      process.env.NODE_ENV === "production" ? false : true;
    // 配置菜单
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "image", // 插入图片
      "table", // 表格
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    if(this.locale !== 'zh-CN') {
      this.editor.customConfig.lang = {
        '设置标题': 'title',
        '正文': 'p',

        '字号': 'font size',

        '字体': 'font family',

        '文字颜色': 'font color',

        '背景色': 'background',

        '链接文字': 'link text',
        '链接': 'link',

        '设置列表': 'settings list',
        '有序列表': 'ordered',
        '无序列表': 'unordered',

        '对齐方式': 'alignment',
        '靠左': 'left',
        '居中': 'center',
        '靠右': 'right',

        '插入': 'insert',

        '上传图片': 'upload image',
        '网络图片': 'web image',
        '图片link': 'image link',

        '表格': ' table',
        '创建': 'create',
        '行': 'rows',
        '列的': 'columns',

        '代码': ' code',
      }
    }

    const vm = this;

    this.editor.customConfig.customUploadImg = (files, insert) => {
      new html5ImgCompress(files[0], {
        done: function(file, fileBase64) {
          UploadImg({fileBase64})
            .then(response => {
              insert(response.data);
            })
            .catch(error => {
              vm.$Message.error(error.message);
            });
        }
      });
    };

    this.editor.create();
  },

  beforeDestroy() {
    this.editor = null;
  },

  methods: {
    getHtml() {
      return this.editor.txt.html();
    }
  }
};
</script>

