import axios, { AxiosInstance } from 'axios';
import { clone } from 'src/utils/clone';

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

export interface LoginSuccessResponse {
  /**
   * Access Token used for authentication.
   * Authorization Header: Bearer <token>
   */
  access_token: string;
  /**
   * Identifier of devices used for login
   * e.g. 'GHTYAJCE'
   */
  device_id: string;
  /**
   * @<username>:<homeserver>
   * e.g. '@cheeky_monkey:matrix.org'
   */
  user_id: string;
}

export interface CurrentLogin {
  /**
   * Access Token used for authentication.
   * Authorization Header: Bearer <token>
   */
  accessToken: string;
  /**
   * Identifier of devices used for login
   * e.g. 'GHTYAJCE'
   */
  deviceId: string;
  /**
   * @<username>:<homeserver>
   * e.g. '@cheeky_monkey:matrix.org'
   */
  userId: string;
}

const parseLoginSuccessResponse = (
  value: LoginSuccessResponse
): CurrentLogin => {
  return {
    accessToken: value.access_token,
    deviceId: value.device_id,
    userId: value.user_id,
  };
};

// export interface LoginSuccess {
//   url: string;
//   currentLogin: CurrentLogin;
// }

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

  static CLIENT = '/_matrix/client';
  static CLIENT_VERSION = '/v1';
  static CLIENT_PREFIX = `${this.CLIENT}${this.CLIENT_VERSION}`;
  static ENDPOINTS = {
    versions: `${this.CLIENT}/versions`,
    login: `${this.CLIENT_PREFIX}/login`,
    logout: `${this.CLIENT_PREFIX}/logout`,
  };

  constructor(/* private homeserverUrl: string */) {
    // this.axios = axios.create({ baseURL: homeserverUrl });
  }

  private throwIfNoHomeserver() {
    if (this.axios === null) throw new NoHomeServerError();
  }

  loadConnection(currentLogin: CurrentLogin) {
    this.currentLogin = clone(currentLogin);
    const domain = this.currentLogin.userId.split(':')[1];
    this.homeserver(domain);
    this.currentLogin = this.currentLogin;
    this.setBearerToken(this.currentLogin.accessToken);
  }

  private setBearerToken(token: string) {
    this.axios = axios.create({
      baseURL: this.homeserverUrl,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
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

  async login(username: string, password: string): Promise<CurrentLogin> {
    this.throwIfNoHomeserver();
    const matrixLogin = new MatrixLogin(username, password);
    const loginResponse = await this.axios?.post(
      MatrixService.ENDPOINTS.login,
      matrixLogin
    );

    if (loginResponse?.status === HTTP_CODES.success) {
      const loginData: LoginSuccessResponse = loginResponse.data;
      this.setBearerToken(loginData.access_token);
      this.currentLogin = parseLoginSuccessResponse(loginData);
    } else throw new Error('Login failed');

    return this.currentLogin;
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
