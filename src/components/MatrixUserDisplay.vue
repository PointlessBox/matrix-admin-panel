<template>
  <span>
    <b>{{ username }}</b
    ><span v-if="!isMobile" style="font-size: 0.75rem">:{{ domain }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MatrixUserDisplay',
  props: {
    username: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    isMobile: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
