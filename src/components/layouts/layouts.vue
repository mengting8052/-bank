<template>
  <hero-layout
    :locale="locale"
    :username="user.userName"
    :menu-data="menuData"
    :route-matched="routeMatched"
    @user-info-click="userinfo"
    @user-pwd-click="userpwd"
    @user-logout-click="userlogout"
  >
    <div slot="content">
      <router-view></router-view>
    </div>
  </hero-layout>
</template>

<script>
import { FRONTEND_DOMAIN, ENV } from "../../utils/env";
import Lang from "../../utils/lang";
import { mapGetters } from "vuex";

export default {
  name: "gvt-layouts",

  computed: {
    ...mapGetters(["user", "menus"])
  },

  data() {
    return {
      menuData: [],
      routeMatched: [],
      locale: Lang.getLang()
    };
  },

  watch: {
    $route() {
      this.routeMatched = this.$route.matched;
    }
  },

  created() {
    this.routeMatched = this.$route.matched;
  },

  mounted() {
    this.$nextTick(() => {
      this.menuData = ENV === "development" ? this.mockMenuData() : this.menus;
    });
  },

  methods: {
    userinfo() {
      console.log("user info click");
    },

    userpwd() {
      console.log("user pwd click");
    },

    userlogout() {
      this.$store.dispatch("Logout");
    },

    mockMenuData() {
      const isTenant = this.user.isTenant;
      return isTenant ? this.tenantMenu() : this.gvtMenu();
    },

    gvtMenu() {
      const domain = FRONTEND_DOMAIN;
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
            {
              name: "跨境进口清单",
              enName: "Import List",
              uri: `${domain}product/importList`
            },
            {
              name: "负面清单",
              enName: "Negative Product",
              uri: `${domain}product/negative`
            },
            {
              name: "校验配置",
              enName: "Config",
              uri: `${domain}filing/config`
            }
          ]
        }
      ];
    },

    tenantMenu() {
      const domain = FRONTEND_DOMAIN;
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
    }
  }
};
</script>
