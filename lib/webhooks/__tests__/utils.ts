import crypto from 'crypto';

import express from 'express';

import {ShopifyHeader} from '../../types';

export function getTestExpressApp() {
  const parseRawBody = (req: any, _res: any, next: any) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', (chunk: any) => {
      req.rawBody += chunk;
    });
    req.on('end', () => {
      next();
    });
  };

  const app = express();
  app.use(parseRawBody);
  return app;
}

export function headers({
  hmac = 'fake',
  topic = 'products/create',
  domain = 'shop1.myshopify.io',
  webhookId = '123456789',
  lowercase = false,
}: {
  hmac?: string;
  topic?: string;
  domain?: string;
  webhookId?: string;
  lowercase?: boolean;
} = {}) {
  return {
    [lowercase ? ShopifyHeader.Hmac.toLowerCase() : ShopifyHeader.Hmac]: hmac,
    [lowercase ? ShopifyHeader.Topic.toLowerCase() : ShopifyHeader.Topic]:
      topic,
    [lowercase ? ShopifyHeader.Domain.toLowerCase() : ShopifyHeader.Domain]:
      domain,
    [lowercase
      ? ShopifyHeader.WebhookId.toLowerCase()
      : ShopifyHeader.WebhookId]: webhookId,
  };
}

export function hmac(secret: string, body: string) {
  return crypto.createHmac('sha256', secret).update(body).digest('base64');
}
