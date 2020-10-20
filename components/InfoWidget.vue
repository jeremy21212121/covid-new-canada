<template>
  <aside class="ripple">
    <a href="#more-info" title="More information about this chart">
      <span class="round" aria-hidden="true">i</span>
      <last-updated :updated="updated" />
      <span class="more-info"
        >Click here for more information about this chart and it's
        sources.</span
      >
    </a>
  </aside>
</template>

<script>
import LastUpdated from "@/components/LastUpdated.vue";
export default {
  name: "InfoWidget",
  components: {
    LastUpdated
  },
  props: {
    updated: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
aside {
  /* display: flex; */
  width: 95%;
  /* padding: 1%; */
  margin-top: 2px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08),
    0 5px 26px 0 rgba(67, 94, 131, 0.15);
  color: rgba(0, 0, 0, 0.8);
}
a {
  /* display: block; */
  display: flex;
  flex-wrap: wrap;
  padding: 1%;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.8);
}
.ripple {
  background-position: center;
  transition: background 70ms;
}
.ripple:hover {
  background: rgba(71, 167, 245, 0.05)
    radial-gradient(circle, transparent 1%, rgba(71, 167, 245, 0.1) 1%)
    center/15000%;
  transition: background 600ms;
}
.ripple:active {
  background-color: rgba(110, 185, 247, 0.2);
  background-size: 100%;
  transition: background 0s;
}
.round {
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.8);
  text-align: center;
  width: 18px;
  height: 18px;
  line-height: 18px;
  margin-right: 18px;
  /* padding: 2px; */
}
.more-info {
  margin-left: 18px;
}
</style>
