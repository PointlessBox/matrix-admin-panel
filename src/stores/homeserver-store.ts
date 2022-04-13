import { defineStore } from 'pinia';
import { CurrentLogin } from 'src/network/matrix-service';
import { LocalStorage } from 'quasar';
import Services from 'src/network/services';

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
  return {
    currentLogin: {
      deviceId: '',
      userId: '',
      accessToken: '',
    },
  };
};

const loadCurrentLogin = (): CurrentLogin => {
  const currentLogin = LocalStorage.getItem<CurrentLogin>(CURRENT_LOGIN);
  if (currentLogin) {
    Services.matrixService.loadConnection(currentLogin);
  }
  return currentLogin
    ? currentLogin
    : {
        deviceId: '',
        userId: '',
        accessToken: '',
      };
};

const loadState = (): HomeserverState => {
  const state = produceEmptyState();
  state.currentLogin = loadCurrentLogin();
  return state;
};

export const useHomeserverStore = defineStore('homeserver', {
  state: () => ({ ...loadState() }),
  getters: {
    isLoggedIn: (state): boolean => state.currentLogin.accessToken.length > 0,
    user: (state): string => extractUser(state.currentLogin.userId),
    domain: (state): string => extractDomain(state.currentLogin.userId),
  },
  actions: {
    onLogin(loginData: CurrentLogin) {
      const newState = { currentLogin: loginData };
      // Set ONLY current login in local storage
      LocalStorage.set(CURRENT_LOGIN, loginData);
      // Patch WHOLE state
      this.$patch(newState);
    },
    onLogout() {
      LocalStorage.remove(CURRENT_LOGIN);
      this.$patch(produceEmptyState());
    },
  },
});
