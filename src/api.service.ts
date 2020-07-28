import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CollectionRef, EntityRef} from './references';

export let API_URL = new InjectionToken('api.uri');

@Injectable()
export class ApiService {

  constructor(@Inject(API_URL) private api_url: string, private http: HttpClient) {
  }

  collection(name: string): CollectionRef {
    return new CollectionRef(this.getUrl(name), this.http);
  }

  entity(url: string): EntityRef {
    return new EntityRef(url, this.http);
  }

  private getUrl(collection?: string): string {
    let url = this.api_url;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    if (collection) {
      return url.concat(collection);
    }
    return url;
  }

}
