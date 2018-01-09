import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {EntityHelper} from './entity-helper';
import {Page} from './page';
import {Entity} from './entity';

export class CollectionRef {

  constructor(private url: string, private http: HttpClient) {
  }

  entity(id: any): EntityRef {
    return new EntityRef(this.extendUrl(id), this.http);
  }

  filter(query: string): FilteredCollectionRef {
    return new FilteredCollectionRef(this.extendUrl(query), this.http);
  }

  get <E extends Entity>(type: { new(): E }): Observable<E[]> {
    return this.http.get<Object>(this.url)
      .map<Object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http));
  }

  add(entity: Object): Observable<any> {
    return this.http.post(this.url, EntityHelper.transformForUpdate(entity));
  }

  remove<E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.delete<void>(entity._links.self.href);
    } else {
      return Observable.throw('Entity not initialised');
    }
  }

  paginate(size?: number): PaginatedCollectionRef {
    return new PaginatedCollectionRef(this.url, size, this.http);
  }


  private extendUrl(part?: any): string {
    let _url = this.url;
    if (!_url.endsWith('/')) {
      _url = _url.concat('/');
    }
    if (part) {
      return _url.concat(part);
    }
    return _url;
  }
}

export class FilteredCollectionRef {

  private queryParams: HttpParams = new HttpParams();

  constructor(private url: string, private http: HttpClient) {
  }

  queryParam(param: QueryParam, reset = false): FilteredCollectionRef {
    if (reset) {
      this.queryParams = new HttpParams();
    }
    this.queryParams = this.queryParams.append(param.key, param.value);
    return this;
  }

  get <E extends Entity>(type: { new(): E }): Observable<E[]> {
    return this.http.get<Object>(this.url, {params: this.queryParams})
      .map<Object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http));
  }

  paginate(size?: number): PaginatedCollectionRef {
    return new PaginatedCollectionRef(EntityHelper.addHttpParamsToUrl(this.url, this.queryParams), size, this.http);
  }

}

export class PaginatedCollectionRef {

  private sorting = new HttpParams();
  private sizeParam = new HttpParams();

  constructor(private url: string, private size: number, private http: HttpClient) {
    if (size) {
      this.sizeParam = this.sizeParam.append('size', size.toString());
    }
  }

  sort(sort: Sort): PaginatedCollectionRef {
    this.sorting = this.sorting.append(sort.property, sort.order);
    return this;
  }

  get <E extends Entity>(type: { new(): E }): Observable<Page<E>> {
    const params = this.size ? this.sorting.append('size', this.size.toString()) : this.sorting;
    return this.http.get<Object>(this.url, {params: params})
      .map<Object, Page<E>>(data => EntityHelper.initPage(type, data, this.http));
  }
}

export class EntityRef {

  constructor(private url: string, private http: HttpClient) {
  }

  get <E extends Entity>(type: { new(): E }): Observable<E> {
    return this.http.get<Object>(this.url)
      .map<Object, E>(data => EntityHelper.initEntity(type, data, this.http));
  }
}

export class RelatedCollectionRef {

  constructor(private url: string, private http: HttpClient) {
  }

  get <E extends Entity>(type: { new(): E }): Observable<E[]> {
    return this.http.get<Object>(this.url)
      .map<Object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http));
  }

  paginate(size: number): PaginatedCollectionRef {
    return new PaginatedCollectionRef(this.url, size, this.http);
  }

  add<E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.post<void>(this.url, entity._links.self.href, {headers: new HttpHeaders().set('Content-Type', 'text/uri-list')});
    } else {
      return Observable.throw('Entity not initialised');
    }
  }

  set <E extends Entity>(entities: E[]): Observable<void> {
    if (entities.every(entity => entity._links.self)) {
      const urls: string[] = entities.map<string>(entity => entity._links.self.href);
      return this.http.put<void>(this.url, urls.join('\n'), {headers: new HttpHeaders().set('Content-Type', 'text/uri-list')});
    } else {
      return Observable.throw('Entity not initialised');
    }
  }

  setNull(): Observable<void> {
    return this.http.delete<void>(this.url);
  }

}

export class RelatedEntityRef {

  constructor(private url: string, private http: HttpClient) {
  }

  get <E extends Entity>(type: { new(): E }): Observable<E> {
    return this.http.get<Object>(this.url)
      .map<Object, E>(data => EntityHelper.initEntity(type, data, this.http));
  }

  set <E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.put<void>(this.url, entity._links.self.href, {headers: new HttpHeaders().set('Content-Type', 'text/uri-list')});
    } else {
      return Observable.throw('Entity not initialised');
    }
  }

  setNull(): Observable<void> {
    return this.http.delete<void>(this.url);
  }

}

export interface QueryParam {
  key: string;
  value: string;
}

export interface Sort {
  property: string;
  order?: 'asc' | 'desc';
}
