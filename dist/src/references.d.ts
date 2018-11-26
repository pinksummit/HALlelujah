import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Page } from './page';
import { Entity } from './entity';
export declare class CollectionRef {
    private url;
    private http;
    constructor(url: string, http: HttpClient);
    entity(id: any): EntityRef;
    filter(query: string): FilteredCollectionRef;
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<E[]>;
    add(entity: Object): Observable<any>;
    remove<E extends Entity>(entity: E): Observable<void>;
    paginate(size?: number): PaginatedCollectionRef;
    private extendUrl(part?);
}
export declare class FilteredCollectionRef {
    private url;
    private http;
    private queryParams;
    constructor(url: string, http: HttpClient);
    queryParam(param: QueryParam, reset?: boolean): FilteredCollectionRef;
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<E[]>;
    paginate(size?: number): PaginatedCollectionRef;
}
export declare class PaginatedCollectionRef {
    private url;
    private size;
    private http;
    private sorting;
    private sizeParam;
    constructor(url: string, size: number, http: HttpClient);
    sort(sort: Sort): PaginatedCollectionRef;
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<Page<E>>;
}
export declare class EntityRef {
    private url;
    private http;
    constructor(url: string, http: HttpClient);
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<E>;
}
export declare class RelatedCollectionRef {
    private url;
    private http;
    constructor(url: string, http: HttpClient);
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<E[]>;
    paginate(size: number): PaginatedCollectionRef;
    add<E extends Entity>(entity: E): Observable<void>;
    set<E extends Entity>(entities: E[]): Observable<void>;
    setNull(): Observable<void>;
}
export declare class RelatedEntityRef {
    private url;
    private http;
    constructor(url: string, http: HttpClient);
    get<E extends Entity>(type: {
        new (): E;
    }): Observable<E>;
    set<E extends Entity>(entity: E): Observable<void>;
    setNull(): Observable<void>;
}
export interface QueryParam {
    key: string;
    value: string;
}
export interface Sort {
    property: string;
    order?: 'asc' | 'desc';
}
