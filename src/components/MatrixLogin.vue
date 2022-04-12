<template>
  <div>
    <q-form @submit="login">
      <q-input
        square
        outlined
        class="q-mb-md"
        v-model.trim="homeserverDomain"
        :label="t('homeserver')"
        :rules="[homeserverValidation]"
      />
      <q-input
        square
        filled
        v-model.trim="username"
        :label="t('username')"
        type="text"
      />
      <q-input
        square
        filled
        class="q-mt-sm"
        v-model.trim="password"
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
      <div class="row q-mt-md">
        <q-space />
        <q-btn
          flat
          rounded
          :label="t('login.self')"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// import { api as axios } from 'src/boot/axios';
// import MatrixLogin, { SuccessEmit } from './matrix-login';
import { useQuasar } from 'quasar';
import MatrixService from 'src/network/matrix-service';

// const LOGIN_TEMPLATE = 'https://%s/_matrix/client/r0/login';
const MATRIX_ORG = 'matrix.org';

// const loginUrl = (domain: string): string => {
//   return LOGIN_TEMPLATE.replace('%s', removeWhiteSpaces(domain));
// };

// const baseUrl = (domain: string): string => {
//   return `https://${removeWhiteSpaces(domain)}`;
// };

// const removeWhiteSpaces = (value: string): string => {
//   return value.trim();
// };

const EMIT = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};

// const ACCESS_TOKEN_KEY = 'access_token';

export default defineComponent({
  name: 'MatrixLogin',
  components: {},
  emits: [EMIT.SUCCESS, EMIT.FAILURE],
  props: {
    service: MatrixService,
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n(); // Translator function

    const homeserverDomain = ref(MATRIX_ORG); // Defaults to matrix.org
    const username = ref('');
    const password = ref('');
    const showPassword = ref(false);

    // FORM VALIDATION
    async function homeserverValidation(input: string): Promise<boolean> {
      let valid = false;
      props.service?.homeserver(input);
      try {
        // TODO: handle whether user types in only domain or whole url
        // const matrixGetLogin = await axios.get(loginUrl(input));
        const statusCode = await props.service?.connect();
        valid = statusCode === 200;
      } catch (ex) {}
      return valid;
    }

    function login() {
      // TODO: Set a timeout value for access_token if possible
      // login api: https://spec.matrix.org/v1.2/client-server-api/#login
      // password-based login: https://spec.matrix.org/v1.2/client-server-api/#password-based
      props.service
        ?.login(username.value, password.value)
        .then((loginSuccess) => {
          $q.notify({
            type: 'positive',
            message: t('login.successful'),
          });
          ctx.emit(EMIT.SUCCESS, loginSuccess);
        })
        .catch(() => {
          $q.notify({
            type: 'negative',
            message: t('login.failed'),
          });
          ctx.emit(EMIT.FAILURE);
        });
    }

    return {
      t,
      homeserverDomain,
      username,
      password,
      showPassword,
      homeserverValidation,
      login,
    };
  },
});
</script>
