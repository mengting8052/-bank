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
          uri: `${domain}product/manage`
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
          name: "税务管理",
          enName: "Tax",
          uri: `${domain}product/tax`
        },
        {
          name: "品牌管理",
          enName: "Brand",
          uri: `${domain}product/brand`
        },
        {
          name: "商品审核",
          enName: "Verify",
          uri: `${domain}product/verify`
        }
      ]
    },
    {
      name: "备案信息",
      enName: "Filing",
      uri: `${domain}filing`,
      icon: "icon-mywork",
      childBisFunction: [
        {
          name: "备案口岸",
          enName: "Port",
          uri: `${domain}filing/filingPort`
        },
        {
          name: "HS编码",
          enName: "HS CODE",
          uri: `${domain}filing/filingTax`
        },
        {
          name: "商品完税表",
          enName: "Tax payment form",
          uri: `${domain}filing/paymentTaxForm`
        },
        {
          name: "口岸备案商品",
          enName: "Pro product",
          uri: `${domain}filing/portProdct`
        },
        {
          name: "物流备案商品",
          enName: "Logistics product",
          uri: `${domain}filing/Logistics`
        },
      ]
    }
  ];
```