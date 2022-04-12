<template>
  <span>
    <!-- TODO: Show only username if display is mobile size -->
    <b>{{ username }}</b
    >:<span style="font-size: 0.75rem">{{ domain }}</span>
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
  },
});
</script>
