import { HttpClient, HttpParams } from '@angular/common/http';
import { Entity } from './entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityHelper } from './entity-helper';
import { PaginatedCollectionRef } from './paginated-collection-ref';
import { QueryParam } from './query-param';

export class FilteredCollectionRef {
  private queryParams: HttpParams = new HttpParams();

  constructor(private url: string, private http: HttpClient) {}

  queryParam(param: QueryParam, reset = false): FilteredCollectionRef {
    if (reset) {
      this.queryParams = new HttpParams();
    }
    this.queryParams = this.queryParams.append(param.key, param.value);
    return this;
  }

  get<E extends Entity>(type: new () => E): Observable<E[]> {
    return this.http
      .get<object>(this.url, { params: this.queryParams })
      .pipe(
        map<object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http))
      );
  }

  paginate(size?: number): PaginatedCollectionRef {
    return new PaginatedCollectionRef(EntityHelper.addHttpParamsToUrl(this.url, this.queryParams), size, this.http);
  }
}
