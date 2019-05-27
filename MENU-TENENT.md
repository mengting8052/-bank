```javascript
  const domain = "http://192.168.1.136:8089/#/";
  return [
    {
      name: "控制台",
      enName: "Console",
      uri: `${domain}console`,
      icon: "icon-mywork"
    },
    {
      name: "商品管理",
      enName: "Products",
      uri: `${domain}product`,
      icon: "icon-cargo",
      childBisFunction: [
        {
          name: "商品管理",
          enName: "Product",
          uri: `${domain}product/tenant`
        },
        {
          name: "商品分类",
          enName: "Category",
          uri: `${domain}product/category`
        },
        {
          name: "商品属性",
          enName: "Attribute",
          uri: `${domain}product/attribute`
        },
        {
          name: "品牌管理",
          enName: "Brand",
          uri: `${domain}product/brand`
        }
      ]
    }
  ];
```