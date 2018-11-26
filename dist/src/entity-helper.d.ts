import { HttpClient, HttpParams } from '@angular/common/http';
import { Entity } from './entity';
import { Page } from './page';
export declare class EntityHelper {
    static transformForUpdate(object: Object): Object;
    static initEntity<E extends Entity>(type: {
        new (): E;
    }, payload: Object, http: HttpClient): E;
    static initEntityCollection<E extends Entity>(type: {
        new (): E;
    }, payload: any, http: HttpClient): E[];
    static initPage<E extends Entity>(type: {
        new (): E;
    }, payload: any, http: HttpClient): Page<E>;
    static stripTemplatedUrl(url: string): string;
    static addHttpParamsToUrl(url: string, params: HttpParams): string;
}
