<template>
  <base-page>
    <matrix-login
      v-if="!homeserverStore.isLoggedIn"
      :service="matrixService"
      @success="updateApi"
    />
  </base-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BasePage from 'src/components/BasePage.vue';
// import { setAuthFor } from 'src/boot/axios';
import MatrixLogin from 'src/components/matrix-login/MatrixLogin.vue';
import { useHomeserverStore } from 'src/stores/homeserver-store';
import { SuccessEmit } from 'src/components/matrix-login/matrix-login';
import Services from 'src/network/services';

export default defineComponent({
  name: 'RegisterUserPage',
  components: { BasePage, MatrixLogin },
  setup() {
    const { t } = useI18n(); // Translator function: t
    const homeserverStore = useHomeserverStore();

    function updateApi(homeserverData: SuccessEmit) {
      homeserverStore.onLogin(homeserverData);
    }

    return {
      t,
      updateApi,
      homeserverStore,
      matrixService: Services.matrixService,
    };
  },
});
</script>
