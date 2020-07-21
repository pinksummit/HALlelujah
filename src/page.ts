import {Observable, throwError} from 'rxjs';
import {EntityHelper} from './entity-helper';
import {HttpClient} from '@angular/common/http';
import {Entity} from './entity';
import {Sort} from './references';
import {map} from 'rxjs/operators';

export class Page<E extends Entity> {

  totalPages = 1;
  totalItems = 0;
  pageNumber = 0;
  size: 0;
  sorting: Sort[] = [];

  items: E[] = [];

  nextUrl: string;
  prevUrl: string;
  firstUrl: string;
  lastUrl: string;
  selfUrl: string;
  selfUrlWithoutPageParam: string;

  constructor(private type: new() => E, private http: HttpClient) {
  }

  next(): Observable<Page<E>> {
    if (this.nextUrl) {
      return this.http.get(this.nextUrl).pipe(
        map(data => EntityHelper.initPage(this.type, data, this.http))
      );
    } else {
      return throwError('No next page available');
    }
  }

  prev(): Observable<Page<E>> {
    if (this.prevUrl) {
      return this.http.get(this.nextUrl).pipe(
        map(data => EntityHelper.initPage(this.type, data, this.http))
      );
    } else {
      return throwError('No previous page available');
    }
  }

  first(): Observable<Page<E>> {
    if (this.firstUrl) {
      return this.http.get(this.nextUrl).pipe(
        map(data => EntityHelper.initPage(this.type, data, this.http))
      );
    } else {
      return throwError('No first page available');
    }
  }

  last(): Observable<Page<E>> {
    if (this.lastUrl) {
      return this.http.get(this.nextUrl).pipe(
        map(data => EntityHelper.initPage(this.type, data, this.http))
      );
    } else {
      return throwError('No last page available');
    }
  }

  /**
   * Functionalities to be added in next version
   *
   page(nr: number): Observable<Page<E>> {
    const httpParams = this.sortParams().append('size', this.size.toString()).append('page', nr.toString());
    return this.http.get(this.baseUrl(), {params: httpParams})
      .map(data => EntityHelper.initPage(this.type, data, this.http));
  }

   resize(size: number): Observable<Page<E>> {
    const httpParams = this.sortParams().append('size', size.toString()).append('page', this.pageNumber.toString());
    return this.http.get(this.baseUrl(), {params: httpParams})
      .map(data => EntityHelper.initPage(this.type, data, this.http));
  }

   sort(sort: Sort, reset = false): Observable<Page<E>> {
    if(reset){
      this.sorting = [];
    }else {
      this.sorting = this.sorting.filter( _sort => !(_sort.property === sort.property));
    }
    this.sorting.push(sort);
    const httpParams = this.sortParams().append('size', this.size.toString()).append('page', this.pageNumber.toString());
    return this.http.get(this.baseUrl(), {params: httpParams})
      .map<Object, Page<E>>(data => EntityHelper.initPage(this.type, data, this.http));
  }



   private sortParams(): HttpParams {
    let httpParams = new HttpParams();
    this.sorting.forEach(sort => httpParams = httpParams.append('sort', sort.property + ',' +sort.order));
    return httpParams;
  }

   private baseUrl(): string{
    return this.selfUrl.substring(0,this.selfUrl.indexOf('?'));
  }

   **/
}


