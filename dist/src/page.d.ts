import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Entity } from './entity';
import { Sort } from './references';
export declare class Page<E extends Entity> {
    private type;
    private http;
    totalPages: number;
    totalItems: number;
    pageNumber: number;
    size: 0;
    sorting: Sort[];
    items: E[];
    nextUrl: string;
    prevUrl: string;
    firstUrl: string;
    lastUrl: string;
    selfUrl: string;
    selfUrlWithoutPageParam: string;
    constructor(type: {
        new (): E;
    }, http: HttpClient);
    next(): Observable<Page<E>>;
    prev(): Observable<Page<E>>;
    first(): Observable<Page<E>>;
    last(): Observable<Page<E>>;
}
