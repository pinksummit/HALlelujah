import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionRef, EntityRef } from './references';
export declare let API_URL: InjectionToken<{}>;
export declare class ApiService {
    private api_url;
    private http;
    constructor(api_url: string, http: HttpClient);
    collection(name: string): CollectionRef;
    entity(url: string): EntityRef;
    private getUrl(collection?);
}
