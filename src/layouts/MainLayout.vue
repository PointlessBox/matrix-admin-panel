<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="mdi-crown"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Register Matrix User</q-toolbar-title>
        <q-space />
        <q-btn flat round size="md" icon="mdi-power" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api, removeAuth } from 'src/boot/axios';
// import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import TODO from 'src/utils/todo';

const LOGOUT_ENDPOINT = '/_matrix/client/v3/logout';

export default defineComponent({
  name: 'MainLayout',

  components: {},
  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const { t } = useI18n();

    function logout() {
      // axios
      //   .create({
      //     baseURL: 'https://mx.smallcoffee.de',
      //     headers: {
      //       authorization:
      //         'Bearer syt_cml0emVua29ib2xk_TqgqwnTTMrEJHsNPNZUE_0l5oW8',
      //     },
      //   })
      api
        .post(LOGOUT_ENDPOINT)
        .then(() => {
          $q.notify({
            type: 'negative',
            message: t('logout.successful'),
          });
          removeAuth();
        })
        .catch((err) => {
          $q.notify({
            type: 'negative',
            message: t('logout.failed'),
          });
          console.error(err);
        });
    }

    return {
      TODO,
      logout,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
