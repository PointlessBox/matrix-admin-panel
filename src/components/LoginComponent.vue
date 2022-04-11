<template>
  <div>
    <q-input
      square
      outlined
      v-model="homeserverUrl"
      :label="t('homeserver')"
      type="url"
      :rules="[homeserverValidation]"
    />
    <q-input
      square
      filled
      v-model="username"
      :label="t('username')"
      type="text"
    />
    <q-input
      square
      filled
      class="q-mt-sm"
      v-model="password"
      :label="t('password')"
      :type="showPassword ? 'text' : 'password'"
      icon
    >
      <template v-slot:append>
        <q-btn
          round
          flat
          :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { api as axios } from 'src/boot/axios';

const LOGIN_TEMPLATE = 'https://%s/_matrix/client/r0/login';

export default defineComponent({
  name: 'RegisterUserPage',
  components: {},
  emits: ['success', 'failure'],
  setup(_props, ctx) {
    const { t } = useI18n(); // Translator function: t

    const homeserverUrl = ref('');
    const username = ref('');
    const password = ref('');
    const showPassword = ref(false);

    // FORM VALIDATION
    async function homeserverValidation(input: string): Promise<boolean> {
      let valid = false;
      try {
        // TODO: handle whether user types in only domain or whole url
        const matrixGetLogin = await axios.get(
          LOGIN_TEMPLATE.replace('%s', input)
        );
        valid = matrixGetLogin.status === 401;
      } catch (ex) {}
      // TODO: Handle CORS
      return valid;
    }

    async function login() {
      const success = false;
      // TODO: Call matrix login api and emit access_token
      // TODO: Set a timeout value for access_token if possible
      // login api: https://spec.matrix.org/v1.2/client-server-api/#login
      // password-based login: https://spec.matrix.org/v1.2/client-server-api/#password-based
      if (success) ctx.emit('success', 'ACCESS_TOKEN');
      else ctx.emit('failure');
    }

    return {
      t,
      homeserverUrl,
      username,
      password,
      showPassword,
      homeserverValidation,
    };
  },
});
</script>
