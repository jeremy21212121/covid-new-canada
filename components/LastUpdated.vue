<template>
  <span v-if="updated && updated.length" :title="'Updated ' + updated + ' GMT'"
    >Data last updated {{ formattedTime }} ago.</span
  >
</template>

<script>
import humanTime from "@/utils/humanTime";

export default {
  name: "LastUpdatedWidget",
  props: {
    updated: {
      type: String,
      default: ""
    }
    // ready: {
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    isReady() {
      return this.updated && this.updated.length
    },
    formattedTime() {
      let output = ''
      if (this.isReady) {
        // time will be NaN if `updated` is an invalid time string
        const time = new Date(this.updated + "Z").getTime();
        if (!Number.isNaN(time)) {
          output = humanTime(time)
        }
      }
      return output;
    }
  }
};
</script>
