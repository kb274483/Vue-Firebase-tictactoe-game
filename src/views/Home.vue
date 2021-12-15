<template>
  <div id="nav">
    <div v-if="!loginSuccess">
      <div class="login">
        <div class="loginInfo">
          <div class="mail box">
            <input type="text" placeholder="E-mail" v-model="email" />
          </div>
          <div class="password box">
            <input
              type="password"
              placeholder="Password"
              ref="loginPassword"
              v-model="password"
            />
          </div>
        </div>
        <div class="loginBTN">
          <div>
            <button @click="login">直接登入</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <router-link to="/single">單機</router-link>
      <router-link to="/double">連線</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { firebaseAuth } from "../firebase";
import { ref } from "vue";

export default {
  name: "Home",
  setup() {
    const email = ref("tictactoe@test.com"); //測試用帳號
    const password = ref("tictactoe"); //測試用密碼
    const loginSuccess = ref(false);
    const login = () => {
      // console.log("Submit", firebaseAuth());
      firebaseAuth
        .signInWithEmailAndPassword(email.value, password.value)
        .then((res) => {
          console.log(res);
          loginSuccess.value = !loginSuccess.value;
        })
        .catch((error) => {
          console.log(error);
        });
    };
    return { login, email, password, loginSuccess };
  },
};
</script>

<style lang="scss" scoped>
#nav {
  height: 100vh;
  width: 100%;
  background-color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    border: 3px solid #fff;
    border-radius: 10px;
    color: #fff;
    text-decoration: none;
    text-shadow: #000 3px 3px;
    padding: 10px 20px;
    margin: 5px;
  }
  .login {
    .logo {
      margin-top: 4.3%;
      display: flex;
      justify-content: center;
    }
    .notice {
      margin-top: 10%;
      text-align: center;
      margin-bottom: 10%;
      p {
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
      }
    }
    .loginInfo {
      .box {
        margin: 0 auto;
        width: 100%;
        height: 30px;
        input {
          padding-left: 20px;
          width: 100%;
          height: 100%;
          border: none;
          border-bottom: 1px solid black;
          border-radius: 10px;
        }
      }
      .mail {
        span {
          color: red;
        }
      }
      .password {
        position: relative;
        margin: 10% auto;
      }
    }
    .loginBTN {
      width: 100%;
      margin-top: 20%;
      display: flex;
      justify-content: center;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60%;
        height: 38px;
        background: var(--gradient);
        border-radius: 9px;
        button {
          background: none;
          width: 99%;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0);
          background: #fff;
          border-radius: 9px;
        }
      }
    }
  }
}
</style>
