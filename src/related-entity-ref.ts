import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entity } from './entity';
import { EntityHelper } from './entity-helper';
import { map } from 'rxjs/operators';

export class RelatedEntityRef {
  constructor(private url: string, private http: HttpClient) {}

  get<E extends Entity>(type: new () => E): Observable<E> {
    return this.http.get<object>(this.url).pipe(
      map<object, E>(data => EntityHelper.initEntity(type, data, this.http))
    );
  }

  set<E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.put<void>(this.url, entity._links.self.href, {
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
