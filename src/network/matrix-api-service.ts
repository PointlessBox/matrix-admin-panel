import * as sdk from 'matrix-js-sdk';
import {
  MatrixHttpApi,
  IHttpOpts,
  HttpApiEvent,
  HttpApiEventHandlerMap,
} from 'matrix-js-sdk';
import { TypedEventEmitter } from 'matrix-js-sdk/lib/models/typed-event-emitter';

let instance: MatrixApiService | null = null;

const getApi = (): MatrixApiService => {
  if (!instance)
    throw new Error(
      "API instance does not exist. Initialize instance with 'setApi'"
    );

  return instance;
};

const initApi = (opts: IHttpOpts): void => {
  instance = new MatrixApiService(opts);
};

export type ClientPrefix = typeof sdk.PREFIX_V1;

export { getApi, initApi };

export default interface IMatrixApiService {
  login(): void;
  logout(): void;
  registerUser(): void;
}

class MatrixApiService implements IMatrixApiService {
  private emitter!: TypedEventEmitter<
    HttpApiEvent,
    HttpApiEventHandlerMap,
    HttpApiEventHandlerMap
  >;
  private matrixApi!: MatrixHttpApi;

  constructor(opts: IHttpOpts) {
    this.emitter = new TypedEventEmitter();
    this.matrixApi = new MatrixHttpApi(this.emitter, opts);
  }
  login(): void {
    throw new Error('Method not implemented.');
  }
  logout(): void {
    throw new Error('Method not implemented.');
  }
  registerUser(): void {
    throw new Error('Method not implemented.');
  }
}
