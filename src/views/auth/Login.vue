<template>
  <hero-login @login="submit" :locale="locale"></hero-login>
</template>

<script>
import md5 from "js-md5";
import { login } from "../../api/auth";
import Auth from "../../utils/auth";
import Lang from "../../utils/lang"

export default {
  data() {
    return {
      locale: Lang.getLang()
    }
  },

  methods: {
    submit(user) {
      const params = Object.assign({}, user, {
        password: md5(user.password)
      });
      login(params)
        .then(response => {
          if (response.code == "200") {
            const jwt = response.data.token;
            Auth.setToken(jwt);
            this.$router.push("/");
          } else {
            this.$Message.error(response.message);
          }
        })
        .catch(error => {
          this.$Message.error("账户或密码错误");
        });
    }
  }
};
</script>

