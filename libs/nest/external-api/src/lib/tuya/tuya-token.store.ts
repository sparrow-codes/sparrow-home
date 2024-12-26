import { TuyaTokensSave, TuyaTokenStorInterface } from '@tuya/tuya-connector-nodejs';

export class TuyaTokenStore implements TuyaTokenStorInterface {
  private _tokens?: TuyaTokensSave;

  public getAccessToken(): Promise<string | undefined> {
    return Promise.resolve(this._tokens?.access_token);
  }

  public getRefreshToken(): Promise<string | undefined> {
    return Promise.resolve(this._tokens?.refresh_token);
  }

  public setTokens(tokens: TuyaTokensSave): Promise<boolean> {
    this._tokens = tokens;
    return Promise.resolve(false);
  }
}
