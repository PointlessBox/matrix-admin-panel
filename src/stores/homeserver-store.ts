import { defineStore } from 'pinia';
import { LoginSuccess } from 'src/network/matrix-service';

interface HomeserverState {
  url: string;
  currentLogin: {
    username: string;
    accessToken: string;
  };
}

const CURRENT_LOGIN = 'CURRENT_LOGIN';

const produceEmptyState = (): HomeserverState => {
  const loadedLoginRaw = localStorage.getItem(CURRENT_LOGIN);
  if (loadedLoginRaw && loadedLoginRaw?.length > 0) {
    return JSON.parse(loadedLoginRaw);
  } else {
    return {
      url: '',
      currentLogin: {
        username: '',
        accessToken: '',
      },
    };
  }
};

export const useHomeserverStore = defineStore('homeserver', {
  state: () => ({ ...produceEmptyState() }),
  getters: {
    isLoggedIn: (state): boolean => state.currentLogin.accessToken.length > 0,
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    onLogin(loginSuccess: LoginSuccess) {
      localStorage.setItem(CURRENT_LOGIN, JSON.stringify(loginSuccess));
      this.$patch(loginSuccess);
    },
    onLogout() {
      localStorage.removeItem(CURRENT_LOGIN);
      this.$patch(produceEmptyState());
    },
    // increment() {
    //   // this.counter++;
    // },
  },
});
