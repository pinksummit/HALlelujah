import { HttpClient } from '@angular/common/http';
import { RelatedCollectionRef } from './related-collection-ref';
import { RelatedEntityRef } from './related-entity-ref';
import { Observable } from 'rxjs';

export abstract class EntityBase {
  http: HttpClient;
  _links: any;

  constructor() {}

  abstract relatedCollection(name: string): RelatedCollectionRef;
  abstract relatedEntity(name: string): RelatedEntityRef;
  abstract save(): Observable<void>;
  abstract update(object: object): Observable<void>;
}
