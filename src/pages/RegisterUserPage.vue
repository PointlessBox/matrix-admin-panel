<template>
  <base-page>
    <matrix-login />
  </base-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BasePage from 'src/components/BasePage.vue';
import { api as axios } from 'src/boot/axios';
import MatrixLogin from 'src/components/MatrixLogin.vue';

export default defineComponent({
  name: 'RegisterUserPage',
  components: { BasePage, MatrixLogin },
  setup() {
    const { t } = useI18n(); // Translator function: t

    return {
      t,
    };
  },
});
</script>
