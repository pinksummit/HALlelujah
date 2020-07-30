import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EntityHelper } from './entity-helper';
import { Entity } from './entity';
import { map } from 'rxjs/operators';
import { EntityRef } from './entity-ref';
import { FilteredCollectionRef } from './filtered-collection-ref';
import { PaginatedCollectionRef } from './paginated-collection-ref';

export class CollectionRef {
  constructor(private url: string, private http: HttpClient) {}

  entity(id: any): EntityRef {
    return new EntityRef(this.extendUrl(id), this.http);
  }

  filter(query: string): FilteredCollectionRef {
    return new FilteredCollectionRef(this.extendUrl(query), this.http);
  }

  get<E extends Entity>(type: new () => E): Observable<E[]> {
    return this.http.get<object>(this.url).pipe(
      map<object, E[]>(data => EntityHelper.initEntityCollection(type, data, this.http))
    );
  }

  add(entity: object): Observable<any> {
    return this.http.post(this.url, EntityHelper.transformForUpdate(entity));
  }

  remove<E extends Entity>(entity: E): Observable<void> {
    if (entity._links.self) {
      return this.http.delete<void>(entity._links.self.href);
    } else {
      return throwError('Entity not initialised');
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
