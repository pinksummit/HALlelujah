import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Entity } from './entity';
import { map } from 'rxjs/operators';
import { SortOptions } from './sort-options';
import { EntityBase } from './entity-base';
import { EntityHelper } from './entity-helper';

export class Page<E extends Entity> {
  totalPages = 1;
  totalItems = 0;
  pageNumber = 0;
  size: 0;
  sorting: SortOptions[] = [];

  items: E[] = [];

  nextUrl: string;
  prevUrl: string;
  firstUrl: string;
  lastUrl: string;
  selfUrl: string;
  selfUrlWithoutPageParam: string;

  constructor(private type: new () => E, private http: HttpClient) {}

  static initPage<E extends EntityBase>(type: new () => E, payload: any, http: HttpClient): Page<E> {
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

  next(): Observable<Page<E>> {
    if (this.nextUrl) {
      return this.http.get(this.nextUrl).pipe(map(data => Page.initPage(this.type, data, this.http)));
    } else {
      return throwError('No next page available');
    }
  }

  prev(): Observable<Page<E>> {
    if (this.prevUrl) {
      return this.http.get(this.nextUrl).pipe(map(data => Page.initPage(this.type, data, this.http)));
    } else {
      return throwError('No previous page available');
    }
  }

  first(): Observable<Page<E>> {
    if (this.firstUrl) {
      return this.http.get(this.nextUrl).pipe(map(data => Page.initPage(this.type, data, this.http)));
    } else {
      return throwError('No first page available');
    }
  }

  last(): Observable<Page<E>> {
    if (this.lastUrl) {
      return this.http.get(this.nextUrl).pipe(map(data => Page.initPage(this.type, data, this.http)));
    } else {
      return throwError('No last page available');
    }
  }

  /**
   * TODO functionalities to be added in a future version
   */
  // page(nr: number): Observable<Page<E>> {
  //   const httpParams = this.sortParams().append('size', this.size.toString()).append('page', nr.toString());
  //   return this.http
  //     .get(this.baseUrl(), { params: httpParams })
  //     .map(data => EntityHelper.initPage(this.type, data, this.http));
  // }
  //
  // resize(size: number): Observable<Page<E>> {
  //   const httpParams = this.sortParams().append('size', size.toString()).append('page', this.pageNumber.toString());
  //   return this.http
  //     .get(this.baseUrl(), { params: httpParams })
  //     .map(data => EntityHelper.initPage(this.type, data, this.http));
  // }
  //
  // sort(sort: SortOptions, reset = false): Observable<Page<E>> {
  //   if (reset) {
  //     this.sorting = [];
  //   } else {
  //     this.sorting = this.sorting.filter(_sort => !(_sort.property === sort.property));
  //   }
  //   this.sorting.push(sort);
  //   const httpParams = this.sortParams()
  //     .append('size', this.size.toString())
  //     .append('page', this.pageNumber.toString());
  //   return this.http
  //     .get(this.baseUrl(), { params: httpParams })
  //     .map<object, Page<E>>(data => EntityHelper.initPage(this.type, data, this.http));
  // }
  //
  // private sortParams(): HttpParams {
  //   let httpParams = new HttpParams();
  //   this.sorting.forEach(sort => (httpParams = httpParams.append('sort', sort.property + ',' + sort.order)));
  //   return httpParams;
  // }
  //
  // private baseUrl(): string {
  //   return this.selfUrl.substring(0, this.selfUrl.indexOf('?'));
  // }
}
