import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Main.vue";
import Blogs from "../views/Blogs.vue";
import TermsAndConditions from "../views/TermsAndConditions.vue";
import RefundPolicy from "../views/RefundPolicy.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";

const routes = [
  {
    path: "",
    name: "Home",
    component: Home,
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
  },
  {
    path: "/termsandconditions",
    name: "TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    path: "/refund-policy",
    name: "RefundPolicy",
    component: RefundPolicy,
  },
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
