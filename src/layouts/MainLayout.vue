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
        <span v-if="homeserverStore.isLoggedIn">
          <matrix-user-display
            :username="homeserverStore.user"
            :domain="homeserverStore.domain"
            :is-mobile="q.screen.lt.sm"
          />
          <q-btn flat round size="md" icon="mdi-power" @click="logout" />
        </span>
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
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import TODO from 'src/utils/todo';
import Services from 'src/network/services';
import Do from 'src/utils/do';
import { useHomeserverStore } from 'src/stores/homeserver-store';
import MatrixUserDisplay from 'src/components/MatrixUserDisplay.vue';

export default defineComponent({
  name: 'MainLayout',

  components: { MatrixUserDisplay },
  setup() {
    const leftDrawerOpen = ref(false);
    const q = useQuasar();
    const { t } = useI18n();
    const homeserverStore = useHomeserverStore();

    function logout() {
      Services.matrixService
        .logout()
        .then(() => {
          q.notify({
            type: 'positive',
            message: t('logout.successful'),
          });
          homeserverStore.onLogout();
        })
        .catch((err) => {
          q.notify({
            type: 'negative',
            message: t('logout.failed'),
          });
          Do.ifNotProd(() => console.error(err));
        });
    }

    return {
      TODO,
      logout,
      q,
      leftDrawerOpen,
      homeserverStore,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
