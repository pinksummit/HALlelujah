import { EntityHelper } from './entity-helper';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Entity } from './entity';
import { HttpClient } from '@angular/common/http';

export class EntityRef {
  constructor(private url: string, private http: HttpClient) {}

  get<E extends Entity>(type: new () => E): Observable<E> {
    return this.http.get<object>(this.url).pipe(
      map<object, E>(data => EntityHelper.initEntity(type, data, this.http))
    );
  }
}
