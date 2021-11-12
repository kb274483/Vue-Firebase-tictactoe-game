<template>
  <div id="nav">
    <router-link to="/single">單機</router-link>
    <router-link to="/double">連線</router-link>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
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
}
</style>
