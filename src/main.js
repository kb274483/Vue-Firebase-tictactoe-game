import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import bootstrap from "bootstrap";
import "bootstrap/scss/bootstrap.scss";

const app = createApp(App);
app.use(bootstrap);
app.use(router);
app.mount("#app");
