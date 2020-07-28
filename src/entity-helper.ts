import {HttpClient, HttpParams} from '@angular/common/http';
import {Entity} from './entity';
import {Page} from './page';

// @dynamic
export class EntityHelper {

  static transformForUpdate(object: Object): Object {
    const result: any = {};
    for (const key in object) {
      if (object[key] instanceof Entity) {
        result[key] = EntityHelper.stripTemplatedUrl(object[key]['_links']['self']['href']);
      } else if (object[key] !== '_links') {
        result[key] = object[key];
      }
    }
    return result as Object;
  }

  static initEntity<E extends Entity>(type: new() => E, payload: Object, http: HttpClient): E {
    const entity = new type();
    for (const p in payload) {
      entity[p] = payload[p];
    }
    entity.http = http;
    return entity;
  }

  static initEntityCollection<E extends Entity>(type: new() => E, payload: any, http: HttpClient): E[] {
    return payload._embedded[Object.keys(payload['_embedded'])[0]]
      .map(item => EntityHelper.initEntity(type, item, http));
  }

  static initPage<E extends Entity>(type: new() => E, payload: any, http: HttpClient): Page<E> {
    const page = new Page(type, http);
    page.items = EntityHelper.initEntityCollection(type, payload, http);
    page.totalItems = payload.page ? payload.page.totalElements : page.items.length;
    page.totalPages = payload.page ? payload.page.totalPages : 1;
    page.pageNumber = payload.page ? payload.page.number : 1;
    page.selfUrl = payload._links.self ? EntityHelper.stripTemplatedUrl(payload._links.self.href) : undefined;
    page.nextUrl = payload._links.next ? EntityHelper.stripTemplatedUrl(payload._links.next.href) : undefined;
    page.prevUrl = payload._links.prev ? EntityHelper.stripTemplatedUrl(payload._links.prev.href) : undefined;
    page.firstUrl = payload._links.first ? EntityHelper.stripTemplatedUrl(payload._links.first.href) : undefined;
    page.lastUrl = payload._links.last ? EntityHelper.stripTemplatedUrl(payload._links.last.href) : undefined;
    return page;
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
