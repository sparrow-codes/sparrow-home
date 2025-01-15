import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { decode } from 'html-entities';
// @ts-ignore
import qs from 'querystring';

@Injectable()
export class OAuthClient {
  private readonly clientId = 'vf2i6hW5hA2BB2BQGfTHXM4YFyW4I06K';

  public async ensureAuthenticated(username: string, password: string): Promise<string> {
    Logger.log('Logging into panasonic cloud!');
    const clientId: string = this.clientId;

    const response = await axios({
      method: 'POST',
      url: 'https://aquarea-smart.panasonic.com/remote/v1/api/auth/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://aquarea-smart.panasonic.com/',
        'popup-screen-id': '1001',
        'Registration-Id': '',
      },
      data: null,
      validateStatus: () => true,
    });

    const auth0State =
      response.headers['set-cookie']
        ?.map((cookie) => cookie?.match(/com.auth0.state=(.+?);/i)?.[1])
        .filter((c) => !!c)[0] ?? undefined;

    const response1 = await axios({
      method: 'GET',
      url: `https://authglb.digital.panasonic.com/authorize?${qs.stringify({
        audience: `https://digital.panasonic.com/${clientId}/api/v1/`,
        client_id: clientId,
        redirect_uri: 'https://aquarea-smart.panasonic.com/authorizationCallback',
        response_type: 'code',
        scope: 'openid offline_access',
        state: auth0State,
      })}`,
      headers: {
        Referer: 'https://aquarea-smart.panasonic.com/',
      },
      maxRedirects: 0,
      validateStatus: () => true,
    });
    let auth0Compat =
      response1.headers['set-cookie']
        ?.map((cookie) => cookie?.match(/auth0_compat=(.+?);/i)?.[1])
        .filter((c) => !!c)[0] ?? undefined;
    let auth0 =
      response1.headers['set-cookie']?.map((cookie) => cookie?.match(/auth0=(.+?);/i)?.[1]).filter((c) => !!c)[0] ??
      undefined;
    const did =
      response1.headers['set-cookie']?.map((cookie) => cookie?.match(/did=(.+?);/i)?.[1]).filter((c) => !!c)[0] ??
      undefined;
    const didCompat =
      response1.headers['set-cookie']
        ?.map((cookie) => cookie?.match(/did_compat=(.+?);/i)?.[1])
        .filter((c) => !!c)[0] ?? undefined;

    const location = response1.headers['location'];
    const state = new URL(`https://authglb.digital.panasonic.com${location}`).searchParams.get('state');
    const response2 = await axios({
      method: 'GET',
      url: `https://authglb.digital.panasonic.com${location}`,
      headers: {
        Referer: 'https://aquarea-smart.panasonic.com/',
        Cookie: `auth0=${auth0}; auth0_compat=${auth0Compat}; did=${did}; did_compat=${didCompat};`,
      },
      maxRedirects: 0,
      validateStatus: () => true,
    });
    if (response2.status !== 200) {
      throw new Error(`Wrong response on location redirect: ${response2.status}`);
    }
    const csrf =
      response2.headers['set-cookie']?.map((cookie) => cookie?.match(/_csrf=(.+?);/i)?.[1]).filter((c) => !!c)[0] ??
      undefined;

    const response3 = await axios({
      method: 'POST',
      url: 'https://authglb.digital.panasonic.com/usernamepassword/login',
      headers: {
        'Auth0-Client': 'eyJuYW1lIjoiYXV0aDAuanMtdWxwIiwidmVyc2lvbiI6IjkuMjMuMiJ9',
        'Content-Type': 'application/json; charset=UTF-8',
        Referer: `https://authglb.digital.panasonic.com/login?${qs.stringify({
          audience: `https://digital.panasonic.com/${clientId}/api/v1/`,
          client: clientId,
          protocol: 'oauth2',
          redirect_uri: 'https://aquarea-smart.panasonic.com/authorizationCallback',
          response_type: 'code',
          scope: 'openid offline_access',
          state: state,
        })}`,
        Cookie: `_csrf=${csrf}; auth0=${auth0}; auth0_compat=${auth0Compat}; did=${did}; did_compat=${didCompat};`,
      },
      data: {
        client_id: clientId,
        redirect_uri: 'https://aquarea-smart.panasonic.com/authorizationCallback?lang=en',
        tenant: 'pdpauthglb-a1',
        response_type: 'code',
        scope: 'openid offline_access',
        audience: `https://digital.panasonic.com/${clientId}/api/v1/`,
        _csrf: csrf,
        state: state,
        _intstate: 'deprecated',
        username: username,
        password: password,
        lang: 'en',
        connection: 'PanasonicID-Authentication',
      },
      maxRedirects: 0,
      validateStatus: () => true,
    });

    if (response3.status !== 200) {
      throw new Error(
        `Wrong response for usernamepassword/login: ${response3.status}. Most probably wrong credentials.`
      );
    }
    const actionUrl = response3.data.match(/action="(.+?)"/i)?.[1];
    const inputs = response3.data.match(/<input([^\0]+?)>/gi) ?? [];
    const formData: Record<string, string> = {};
    // @ts-ignore
    inputs.forEach((input) => {
      const name = input.match(/name="(.+?)"/i)?.[1];
      const value = input.match(/value="(.+?)"/i)?.[1];
      if (name && value) {
        formData[name] = decode(value);
      }
    });

    const response4 = await axios({
      method: 'POST',
      url: actionUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: `https://authglb.digital.panasonic.com/login?${qs.stringify({
          audience: `https://digital.panasonic.com/${clientId}/api/v1/`,
          client: clientId,
          protocol: 'oauth2',
          redirect_uri: 'https://aquarea-smart.panasonic.com/authorizationCallback',
          response_type: 'code',
          scope: 'openid offline_access',
          state: state,
        })}`,
        Cookie: `_csrf=${csrf}; auth0=${auth0}; auth0_compat=${auth0Compat}; did=${did}; did_compat=${didCompat};`,
      },
      data: qs.stringify(formData),
      maxRedirects: 0,
      validateStatus: () => true,
    });

    const location1 = response4.headers['location'];

    const response5 = await axios({
      method: 'GET',
      url: `https://authglb.digital.panasonic.com${location1}`,
      headers: {
        Cookie: `_csrf=${csrf}; auth0=${auth0}; auth0_compat=${auth0Compat}; did=${did}; did_compat=${didCompat};`,
      },
      maxRedirects: 0,
      validateStatus: () => true,
    });
    auth0Compat =
      response5.headers['set-cookie']
        ?.map((cookie) => cookie?.match(/auth0_compat=(.+?);/i)?.[1])
        .filter((c) => !!c)[0] ?? undefined;
    auth0 =
      response5.headers['set-cookie']?.map((cookie) => cookie?.match(/auth0=(.+?);/i)?.[1]).filter((c) => !!c)[0] ??
      undefined;

    const location2 = response5.headers['location'];

    const response6 = await axios({
      method: 'GET',
      url: location2,
      headers: {
        Cookie: `_csrf=${csrf}; auth0=${auth0}; auth0_compat=${auth0Compat}; did=${did}; did_compat=${didCompat};`,
      },
      maxRedirects: 0,
      validateStatus: () => true,
    });
    const accessToken: string | undefined =
      response6.headers['set-cookie']
        ?.map((cookie) => cookie?.match(/accessToken=(.+?);/i)?.[1])
        .filter((c) => !!c)[0] ?? undefined;

    console.log(response6.headers);

    if (!accessToken) {
      Logger.error(`Could not authenticate to Aquarea Smart Panasonic. Headers: ${JSON.stringify(response.headers)}`);
      throw new UnauthorizedException();
    }
    Logger.log('Authenticated to Aquarea Smart Panasonic');
    return accessToken;
  }
}
