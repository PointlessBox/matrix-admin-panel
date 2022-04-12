import axios, { AxiosInstance } from 'axios';

class NoHomeServerError extends Error {
  constructor(
    message: string | undefined = 'Homeserver is not set',
    options?: ErrorOptions | undefined
  ) {
    super(message, options);
  }
}

class MatrixLogin {
  private type = 'm.login.password';

  constructor(private user: string, private password: string) {}
}

export interface CurrentLogin {
  username: string;
  accessToken: string;
}

export interface LoginSuccess {
  url: string;
  currentLogin: CurrentLogin;
}

const ACCESS_TOKEN_KEY = 'access_token';
const HTTP_CODES = {
  success: 200,
  notFound: 404,
};

// TODO: Put comments on methods
// login api: https://spec.matrix.org/v1.2/client-server-api/#login
// password-based login: https://spec.matrix.org/v1.2/client-server-api/#password-based
export default class MatrixService {
  private homeserverUrl!: string;
  private axios!: AxiosInstance | null;
  private currentLogin: CurrentLogin | null = null;

  static ENDPOINTS = {
    versions: '/_matrix/client/versions',
    login: '/_matrix/client/r0/login',
    logout: '/_matrix/client/v3/logout',
  };

  constructor(/* private homeserverUrl: string */) {
    // this.axios = axios.create({ baseURL: homeserverUrl });
  }

  private throwIfNoHomeserver() {
    if (this.axios === null) throw new NoHomeServerError();
  }

  homeserver(homeserverUrl: string): MatrixService {
    this.homeserverUrl = `https://${homeserverUrl.trim()}`;
    this.axios = axios.create({ baseURL: this.homeserverUrl });
    return this;
  }

  private resetHomeserver() {
    this.axios = null;
    this.homeserverUrl = '';
  }

  async connect(): Promise<number> {
    this.throwIfNoHomeserver();
    let statusCode = HTTP_CODES.notFound;
    try {
      const versionsResponse = await this.axios?.get(
        MatrixService.ENDPOINTS.versions
      );
      statusCode = versionsResponse!.status;
    } catch (err) {}

    return statusCode;
  }

  async login(username: string, password: string): Promise<LoginSuccess> {
    this.throwIfNoHomeserver();
    const matrixLogin = new MatrixLogin(username, password);
    const loginResponse = await this.axios?.post(
      MatrixService.ENDPOINTS.login,
      matrixLogin
    );

    if (loginResponse?.status === HTTP_CODES.success) {
      const accessToken = loginResponse.data[ACCESS_TOKEN_KEY];
      this.axios = axios.create({
        baseURL: this.homeserverUrl,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      this.currentLogin = {
        username,
        accessToken,
      };
    } else throw new Error('Login failed');

    return {
      url: this.homeserverUrl,
      currentLogin: this.currentLogin,
    };
  }

  async logout(): Promise<undefined> {
    this.throwIfNoHomeserver();
    const logoutResponse = await this.axios?.post(
      MatrixService.ENDPOINTS.logout
    );

    if (logoutResponse?.status === 200) this.resetHomeserver();
    else throw new Error('Logout failed');

    return;
  }
}
