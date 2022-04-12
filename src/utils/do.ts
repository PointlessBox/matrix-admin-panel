export default class Do {
  static ifNotProd(what: () => void) {
    if (!process.env.PROD) what();
  }
}
