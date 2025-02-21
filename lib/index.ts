import {loadRestResources} from '../rest/load-rest-resources';
import {ShopifyRestResources} from '../rest/types';

import {ConfigParams, ConfigInterface} from './base-types';
import {validateConfig} from './config';
import {clientClasses, ShopifyClients} from './clients';
import {shopifyAuth, ShopifyAuth} from './auth';
import {shopifySession, ShopifySession} from './session';
import {shopifyUtils, ShopifyUtils} from './utils';
import {shopifyWebhooks, ShopifyWebhooks} from './webhooks';
import {shopifyBilling, ShopifyBilling} from './billing';
import {logger, ShopifyLogger} from './logger';

export * from './error';
export * from './session/classes';

export * from '../rest/types';
export * from './types';
export * from './base-types';
export * from './session/types';
export * from './auth/types';
export * from './webhooks/types';

export interface Shopify<
  T extends ShopifyRestResources = ShopifyRestResources,
> {
  config: ConfigInterface;
  clients: ShopifyClients;
  auth: ShopifyAuth;
  session: ShopifySession;
  utils: ShopifyUtils;
  webhooks: ShopifyWebhooks;
  billing: ShopifyBilling;
  logger: ShopifyLogger;
  rest: T;
}

export function shopifyApi<T extends ShopifyRestResources>(
  config: ConfigParams<T>,
): Shopify<T> {
  const {restResources, ...libConfig} = config;
  const validatedConfig = validateConfig(libConfig);

  const shopify: Shopify<T> = {
    config: validatedConfig,
    clients: clientClasses(validatedConfig),
    auth: shopifyAuth(validatedConfig),
    session: shopifySession(validatedConfig),
    utils: shopifyUtils(validatedConfig),
    webhooks: shopifyWebhooks(validatedConfig),
    billing: shopifyBilling(validatedConfig),
    logger: logger(validatedConfig),
    rest: {} as T,
  };

  if (restResources) {
    shopify.rest = loadRestResources({
      resources: restResources,
      apiVersion: config.apiVersion,
      RestClient: shopify.clients.Rest,
    }) as T;
  }

  return shopify;
}
