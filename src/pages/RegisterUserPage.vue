<template>
  <base-page>
    <matrix-login @success="updateApi" />
  </base-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BasePage from 'src/components/BasePage.vue';
import { setAuthFor } from 'src/boot/axios';
import MatrixLogin from 'src/components/matrix-login/MatrixLogin.vue';

export default defineComponent({
  name: 'RegisterUserPage',
  components: { BasePage, MatrixLogin },
  setup() {
    const { t } = useI18n(); // Translator function: t

    function updateApi({
      baseUrl,
      accessToken,
    }: {
      baseUrl: string;
      accessToken: string;
    }) {
      // TODO: Save token in local storage with timestamp and add an explicit logout where a user can logout an old token or all tokens
      setAuthFor(baseUrl, accessToken);
    }

    return {
      t,
      updateApi,
    };
  },
});
</script>
