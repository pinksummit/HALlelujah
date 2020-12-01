import { HttpClient, HttpParams } from '@angular/common/http';
import { EntityBase } from './entity-base';

// @dynamic
export class EntityHelper {
  static transformForUpdate(object: object): object {
    const result: any = {};
    for (const key in object) {
      if (object[key] instanceof EntityBase) {
        result[key] = EntityHelper.stripTemplatedUrl(object[key]['_links']['self']['href']);
      } else if (object[key] !== '_links') {
        result[key] = object[key];
      }
    }
    return result as object;
  }

  static initEntity<E extends EntityBase>(type: new () => E, payload: object, http: HttpClient): E {
    const entity = new type();
    for (const p in payload) {
      entity[p] = payload[p];
    }
    entity.http = http;
    return entity;
  }

  static initEntityCollection<E extends EntityBase>(type: new () => E, payload: any, http: HttpClient): E[] {
    return payload._embedded[Object.keys(payload['_embedded'])[0]].map(item =>
      EntityHelper.initEntity(type, item, http)
    );
  }

  static stripTemplatedUrl(url: string): string {
    return url.split('{').shift();
  }

  static addHttpParamsToUrl(url: string, params: HttpParams): string {
    let _url = url;
    if (!url.includes('?')) {
      _url = _url.concat('?');
    }
    return _url.concat(params.toString());
  }
}
