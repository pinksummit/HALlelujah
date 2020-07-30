import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entity } from './entity';
import { PaginatedCollectionRef } from './paginated-collection-ref';
import { EntityHelper } from './entity-helper';
import { map } from 'rxjs/operators';

export class RelatedCollectionRef {
  constructor(private url: string, private http: HttpClient) {}

  get<E extends Entity>(type: new () => E): Observable<E[]> {
    return this.http.get<object>(this.url).pipe(
      map<object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http))
    );
  }

  paginate(size: number): PaginatedCollectionRef {
    return new PaginatedCollectionRef(this.url, size, this.http);
  }

  add<E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.post<void>(this.url, entity._links.self.href, {
        headers: new HttpHeaders().set('Content-Type', 'text/uri-list'),
      });
    } else {
      return throwError('Entity not initialised');
    }
  }

  set<E extends Entity>(entities: E[]): Observable<void> {
    if (entities.every(entity => entity._links.self)) {
      const urls: string[] = entities.map<string>(entity => entity._links.self.href);
      return this.http.put<void>(this.url, urls.join('\n'), {
        headers: new HttpHeaders().set('Content-Type', 'text/uri-list'),
      });
    } else {
      return throwError('Entity not initialised');
    }
  }

  setNull(): Observable<void> {
    return this.http.delete<void>(this.url);
  }
}
