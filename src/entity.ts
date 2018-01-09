import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {EntityHelper} from './entity-helper';
import {RelatedCollectionRef, RelatedEntityRef} from './references';

export abstract class Entity {

  http: HttpClient;
  _links: any;

  constructor() {
  }


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
      return this.http.put<void>(EntityHelper.stripTemplatedUrl(this._links.self.href),
        EntityHelper.transformForUpdate(this));
    } else {
      throw new Error('Entity not initialised');
    }
  }

  update(object: Object): Observable<void> {
    if (this._links.self) {
      return this.http.patch<void>(EntityHelper.stripTemplatedUrl(this._links.self.href), EntityHelper.transformForUpdate(object));
    } else {
      throw new Error('Entity not initialised');
    }
  }

}
