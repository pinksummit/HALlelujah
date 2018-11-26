import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';
import { RelatedCollectionRef, RelatedEntityRef } from './references';
export declare abstract class Entity {
    http: HttpClient;
    _links: any;
    constructor();
    relatedCollection(name: string): RelatedCollectionRef;
    relatedEntity(name: string): RelatedEntityRef;
    save(): Observable<void>;
    update(object: Object): Observable<void>;
}
