import { defineStore } from 'pinia';
import { CurrentLogin } from 'src/network/matrix-service';

interface HomeserverState {
  currentLogin: CurrentLogin;
}

const CURRENT_LOGIN = 'CURRENT_LOGIN';

const extractUser = (matrixUserId: string) => {
  const split = matrixUserId.split(':');
  if (split.length == 2) return split[0];
  else return '';
};

const extractDomain = (matrixUserId: string) => {
  const split = matrixUserId.split(':');
  if (split.length == 2) return split[1];
  else return '';
};

const produceEmptyState = (): HomeserverState => {
  const loadedLoginRaw = localStorage.getItem(CURRENT_LOGIN);
  if (loadedLoginRaw && loadedLoginRaw?.length > 0) {
    return { currentLogin: JSON.parse(loadedLoginRaw) };
  } else {
    return {
      currentLogin: {
        deviceId: '',
        userId: '',
        accessToken: '',
      },
    };
  }
};

export const useHomeserverStore = defineStore('homeserver', {
  state: () => ({ ...produceEmptyState() }),
  getters: {
    isLoggedIn: (state): boolean => state.currentLogin.accessToken.length > 0,
    user: (state): string => extractUser(state.currentLogin.userId),
    domain: (state): string => extractDomain(state.currentLogin.userId),
  },
  actions: {
    onLogin(loginData: CurrentLogin) {
      const newState = { currentLogin: loginData };
      localStorage.setItem(CURRENT_LOGIN, JSON.stringify(newState));
      this.$patch(newState);
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
