import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable as Observable$1 } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

class HallelujahModule {
}
HallelujahModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpClientModule],
                declarations: [],
                exports: [HttpClientModule],
                providers: [HttpClient]
            },] },
];
/**
 * @nocollapse
 */
HallelujahModule.ctorParameters = () => [];

/**
 * @abstract
 */
class Entity {
    constructor() {
    }
    /**
     * @param {?} name
     * @return {?}
     */
    relatedCollection(name) {
        if (this._links[name]) {
            return new RelatedCollectionRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
        }
        else {
            throw new Error('Link ' + name + ' does not exist!');
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    relatedEntity(name) {
        if (this._links[name]) {
            return new RelatedEntityRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
        }
        else {
            throw new Error('Link ' + name + ' does not exist!');
        }
    }
    /**
     * @return {?}
     */
    save() {
        if (this._links.self) {
            return this.http.put(EntityHelper.stripTemplatedUrl(this._links.self.href), EntityHelper.transformForUpdate(this));
        }
        else {
            throw new Error('Entity not initialised');
        }
    }
    /**
     * @param {?} object
     * @return {?}
     */
    update(object) {
        if (this._links.self) {
            return this.http.patch(EntityHelper.stripTemplatedUrl(this._links.self.href), EntityHelper.transformForUpdate(object));
        }
        else {
            throw new Error('Entity not initialised');
        }
    }
}

class Page {
    /**
     * @param {?} type
     * @param {?} http
     */
    constructor(type, http$$1) {
        this.type = type;
        this.http = http$$1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.pageNumber = 0;
        this.sorting = [];
        this.items = [];
    }
    /**
     * @return {?}
     */
    next() {
        if (this.nextUrl) {
            return this.http.get(this.nextUrl)
                .map(data => EntityHelper.initPage(this.type, data, this.http));
        }
        else {
            return Observable$1.throw('No next page available');
        }
    }
    /**
     * @return {?}
     */
    prev() {
        if (this.prevUrl) {
            return this.http.get(this.nextUrl)
                .map(data => EntityHelper.initPage(this.type, data, this.http));
        }
        else {
            return Observable$1.throw('No previous page available');
        }
    }
    /**
     * @return {?}
     */
    first() {
        if (this.firstUrl) {
            return this.http.get(this.nextUrl)
                .map(data => EntityHelper.initPage(this.type, data, this.http));
        }
        else {
            return Observable$1.throw('No first page available');
        }
    }
    /**
     * @return {?}
     */
    last() {
        if (this.lastUrl) {
            return this.http.get(this.nextUrl)
                .map(data => EntityHelper.initPage(this.type, data, this.http));
        }
        else {
            return Observable$1.throw('No last page available');
        }
    }
}

class EntityHelper {
    /**
     * @param {?} object
     * @return {?}
     */
    static transformForUpdate(object) {
        const /** @type {?} */ result = {};
        for (const /** @type {?} */ key in object) {
            if (object[key] instanceof Entity) {
                result[key] = EntityHelper.stripTemplatedUrl(object[key]['_links']['self']['href']);
            }
            else if (object[key] !== '_links') {
                result[key] = object[key];
            }
        }
        return (result);
    }
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    static initEntity(type, payload, http$$1) {
        const /** @type {?} */ entity = new type();
        for (const /** @type {?} */ p in payload) {
            entity[p] = payload[p];
        }
        entity.http = http$$1;
        return entity;
    }
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    static initEntityCollection(type, payload, http$$1) {
        return payload._embedded[Object.keys(payload['_embedded'])[0]]
            .map(item => EntityHelper.initEntity(type, item, http$$1));
    }
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    static initPage(type, payload, http$$1) {
        const /** @type {?} */ page = new Page(type, http$$1);
        page.items = EntityHelper.initEntityCollection(type, payload, http$$1);
        page.totalItems = payload.page ? payload.page.totalElements : page.items.length;
        page.totalPages = payload.page ? payload.page.totalPages : 1;
        page.pageNumber = payload.page ? payload.page.number : 1;
        page.selfUrl = payload._links.self ? EntityHelper.stripTemplatedUrl(payload._links.self.href) : undefined;
        page.nextUrl = payload._links.next ? EntityHelper.stripTemplatedUrl(payload._links.next.href) : undefined;
        page.prevUrl = payload._links.prev ? EntityHelper.stripTemplatedUrl(payload._links.prev.href) : undefined;
        page.firstUrl = payload._links.first ? EntityHelper.stripTemplatedUrl(payload._links.first.href) : undefined;
        page.lastUrl = payload._links.last ? EntityHelper.stripTemplatedUrl(payload._links.last.href) : undefined;
        return page;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    static stripTemplatedUrl(url) {
        return url.split('{').shift();
    }
    /**
     * @param {?} url
     * @param {?} params
     * @return {?}
     */
    static addHttpParamsToUrl(url, params) {
        let /** @type {?} */ _url = url;
        if (!url.includes('?')) {
            _url = _url.concat('?');
        }
        return _url.concat(params.toString());
    }
}

class CollectionRef {
    /**
     * @param {?} url
     * @param {?} http
     */
    constructor(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    entity(id) {
        return new EntityRef(this.extendUrl(id), this.http);
    }
    /**
     * @param {?} query
     * @return {?}
     */
    filter(query) {
        return new FilteredCollectionRef(this.extendUrl(query), this.http);
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        return this.http.get(this.url)
            .map(data => EntityHelper.initEntityCollection(type, data, this.http));
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    add(entity) {
        return this.http.post(this.url, EntityHelper.transformForUpdate(entity));
    }
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        if (entity._links.self) {
            return this.http.delete(entity._links.self.href);
        }
        else {
            return Observable$1.throw('Entity not initialised');
        }
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    paginate(size) {
        return new PaginatedCollectionRef(this.url, size, this.http);
    }
    /**
     * @param {?=} part
     * @return {?}
     */
    extendUrl(part) {
        let /** @type {?} */ _url = this.url;
        if (!_url.endsWith('/')) {
            _url = _url.concat('/');
        }
        if (part) {
            return _url.concat(part);
        }
        return _url;
    }
}
class FilteredCollectionRef {
    /**
     * @param {?} url
     * @param {?} http
     */
    constructor(url, http$$1) {
        this.url = url;
        this.http = http$$1;
        this.queryParams = new HttpParams();
    }
    /**
     * @param {?} param
     * @param {?=} reset
     * @return {?}
     */
    queryParam(param, reset = false) {
        if (reset) {
            this.queryParams = new HttpParams();
        }
        this.queryParams = this.queryParams.append(param.key, param.value);
        return this;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        return this.http.get(this.url, { params: this.queryParams })
            .map(data => EntityHelper.initEntityCollection(type, data, this.http));
    }
    /**
     * @param {?=} size
     * @return {?}
     */
    paginate(size) {
        return new PaginatedCollectionRef(EntityHelper.addHttpParamsToUrl(this.url, this.queryParams), size, this.http);
    }
}
class PaginatedCollectionRef {
    /**
     * @param {?} url
     * @param {?} size
     * @param {?} http
     */
    constructor(url, size, http$$1) {
        this.url = url;
        this.size = size;
        this.http = http$$1;
        this.sorting = new HttpParams();
        this.sizeParam = new HttpParams();
        if (size) {
            this.sizeParam = this.sizeParam.append('size', size.toString());
        }
    }
    /**
     * @param {?} sort
     * @return {?}
     */
    sort(sort) {
        this.sorting = this.sorting.append(sort.property, sort.order);
        return this;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        const /** @type {?} */ params = this.size ? this.sorting.append('size', this.size.toString()) : this.sorting;
        return this.http.get(this.url, { params: params })
            .map(data => EntityHelper.initPage(type, data, this.http));
    }
}
class EntityRef {
    /**
     * @param {?} url
     * @param {?} http
     */
    constructor(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        return this.http.get(this.url)
            .map(data => EntityHelper.initEntity(type, data, this.http));
    }
}
class RelatedCollectionRef {
    /**
     * @param {?} url
     * @param {?} http
     */
    constructor(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        return this.http.get(this.url)
            .map(data => EntityHelper.initEntityCollection(type, data, this.http));
    }
    /**
     * @param {?} size
     * @return {?}
     */
    paginate(size) {
        return new PaginatedCollectionRef(this.url, size, this.http);
    }
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    add(entity) {
        if (entity._links.self) {
            return this.http.post(this.url, entity._links.self.href, { headers: new HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable$1.throw('Entity not initialised');
        }
    }
    /**
     * @template E
     * @param {?} entities
     * @return {?}
     */
    set(entities) {
        if (entities.every(entity => entity._links.self)) {
            const /** @type {?} */ urls = entities.map(entity => entity._links.self.href);
            return this.http.put(this.url, urls.join('\n'), { headers: new HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable$1.throw('Entity not initialised');
        }
    }
    /**
     * @return {?}
     */
    setNull() {
        return this.http.delete(this.url);
    }
}
class RelatedEntityRef {
    /**
     * @param {?} url
     * @param {?} http
     */
    constructor(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    get(type) {
        return this.http.get(this.url)
            .map(data => EntityHelper.initEntity(type, data, this.http));
    }
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    set(entity) {
        if (entity._links.self) {
            return this.http.put(this.url, entity._links.self.href, { headers: new HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable$1.throw('Entity not initialised');
        }
    }
    /**
     * @return {?}
     */
    setNull() {
        return this.http.delete(this.url);
    }
}

let API_URL = new InjectionToken('api.uri');
class ApiService {
    /**
     * @param {?} api_url
     * @param {?} http
     */
    constructor(api_url, http$$1) {
        this.api_url = api_url;
        this.http = http$$1;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    collection(name) {
        return new CollectionRef(this.getUrl(name), this.http);
    }
    /**
     * @param {?} url
     * @return {?}
     */
    entity(url) {
        return new EntityRef(url, this.http);
    }
    /**
     * @param {?=} collection
     * @return {?}
     */
    getUrl(collection) {
        let /** @type {?} */ url = this.api_url;
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (collection) {
            return url.concat(collection);
        }
        return url;
    }
}
ApiService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ApiService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [API_URL,] },] },
    { type: HttpClient, },
];

/* SystemJS module definition */

/**
 * Generated bundle index. Do not edit.
 */

export { HallelujahModule, API_URL, ApiService, Entity, EntityHelper, Page, CollectionRef, FilteredCollectionRef, PaginatedCollectionRef, EntityRef, RelatedCollectionRef, RelatedEntityRef };
//# sourceMappingURL=ng2-hallelujah.js.map
