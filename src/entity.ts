import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EntityHelper } from './entity-helper';
import { RelatedEntityRef } from './related-entity-ref';
import { RelatedCollectionRef } from './related-collection-ref';

export abstract class Entity {
  http: HttpClient;
  _links: any;

  protected constructor() {}

  relatedCollection(name: string): RelatedCollectionRef {
    if (this._links[name]) {
      return new RelatedCollectionRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
    } else {
      throw new Error('Link ' + name + ' does not exist!');
    }
  }

  relatedEntity(name: string): RelatedEntityRef {
    if (this._links[name]) {
      return new RelatedEntityRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
    } else {
      throw new Error('Link ' + name + ' does not exist!');
    }
  }

  save(): Observable<void> {
    if (this._links.self) {
      return this.http.put<void>(
        EntityHelper.stripTemplatedUrl(this._links.self.href),
        EntityHelper.transformForUpdate(this)
      );
    } else {
      throw new Error('Entity not initialised');
    }
  }

  update(object: object): Observable<void> {
    if (this._links.self) {
      return this.http.patch<void>(
        EntityHelper.stripTemplatedUrl(this._links.self.href),
        EntityHelper.transformForUpdate(object)
      );
    } else {
      throw new Error('Entity not initialised');
    }
  }
}
