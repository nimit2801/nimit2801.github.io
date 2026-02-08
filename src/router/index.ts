import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Main.vue";
import Blogs from "../views/Blogs.vue";
import TermsAndConditions from "../views/TermsAndConditions.vue";
import RefundPolicy from "../views/RefundPolicy.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import LivestreamPrivacyPolicy from "../views/LivestreamPrivacyPolicy.vue";
import posthog from "posthog-js";

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
  {
    path: "/livestream-privacy-policy",
    name: "LivestreamPrivacyPolicy",
    component: LivestreamPrivacyPolicy,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Track page views
router.afterEach((to) => {
  posthog.capture('$pageview', {
    $current_url: window.location.href,
    page_name: to.name,
    page_path: to.path,
  });
});

export default router;
