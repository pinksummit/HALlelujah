(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/Observable'), require('rxjs/add/operator/map'), require('rxjs/add/operator/catch')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common/http', 'rxjs/Observable', 'rxjs/add/operator/map', 'rxjs/add/operator/catch'], factory) :
	(factory((global['ng2-hallelujah'] = {}),global.ng.core,global.ng.common.http,global.Rx));
}(this, (function (exports,core,http,Observable) { 'use strict';

var HallelujahModule = (function () {
    function HallelujahModule() {
    }
    return HallelujahModule;
}());
HallelujahModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [http.HttpClientModule],
                declarations: [],
                exports: [http.HttpClientModule],
                providers: [http.HttpClient]
            },] },
];
/**
 * @nocollapse
 */
HallelujahModule.ctorParameters = function () { return []; };
/**
 * @abstract
 */
var Entity = (function () {
    function Entity() {
    }
    /**
     * @param {?} name
     * @return {?}
     */
    Entity.prototype.relatedCollection = function (name) {
        if (this._links[name]) {
            return new RelatedCollectionRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
        }
        else {
            throw new Error('Link ' + name + ' does not exist!');
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    Entity.prototype.relatedEntity = function (name) {
        if (this._links[name]) {
            return new RelatedEntityRef(EntityHelper.stripTemplatedUrl(this._links[name].href), this.http);
        }
        else {
            throw new Error('Link ' + name + ' does not exist!');
        }
    };
    /**
     * @return {?}
     */
    Entity.prototype.save = function () {
        if (this._links.self) {
            return this.http.put(EntityHelper.stripTemplatedUrl(this._links.self.href), EntityHelper.transformForUpdate(this));
        }
        else {
            throw new Error('Entity not initialised');
        }
    };
    /**
     * @param {?} object
     * @return {?}
     */
    Entity.prototype.update = function (object) {
        if (this._links.self) {
            return this.http.patch(EntityHelper.stripTemplatedUrl(this._links.self.href), EntityHelper.transformForUpdate(object));
        }
        else {
            throw new Error('Entity not initialised');
        }
    };
    return Entity;
}());
var Page = (function () {
    /**
     * @param {?} type
     * @param {?} http
     */
    function Page(type, http$$1) {
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
    Page.prototype.next = function () {
        var _this = this;
        if (this.nextUrl) {
            return this.http.get(this.nextUrl)
                .map(function (data) { return EntityHelper.initPage(_this.type, data, _this.http); });
        }
        else {
            return Observable.Observable.throw('No next page available');
        }
    };
    /**
     * @return {?}
     */
    Page.prototype.prev = function () {
        var _this = this;
        if (this.prevUrl) {
            return this.http.get(this.nextUrl)
                .map(function (data) { return EntityHelper.initPage(_this.type, data, _this.http); });
        }
        else {
            return Observable.Observable.throw('No previous page available');
        }
    };
    /**
     * @return {?}
     */
    Page.prototype.first = function () {
        var _this = this;
        if (this.firstUrl) {
            return this.http.get(this.nextUrl)
                .map(function (data) { return EntityHelper.initPage(_this.type, data, _this.http); });
        }
        else {
            return Observable.Observable.throw('No first page available');
        }
    };
    /**
     * @return {?}
     */
    Page.prototype.last = function () {
        var _this = this;
        if (this.lastUrl) {
            return this.http.get(this.nextUrl)
                .map(function (data) { return EntityHelper.initPage(_this.type, data, _this.http); });
        }
        else {
            return Observable.Observable.throw('No last page available');
        }
    };
    return Page;
}());
var EntityHelper = (function () {
    function EntityHelper() {
    }
    /**
     * @param {?} object
     * @return {?}
     */
    EntityHelper.transformForUpdate = function (object) {
        var /** @type {?} */ result = {};
        for (var /** @type {?} */ key in object) {
            if (object[key] instanceof Entity) {
                result[key] = EntityHelper.stripTemplatedUrl(object[key]['_links']['self']['href']);
            }
            else if (object[key] !== '_links') {
                result[key] = object[key];
            }
        }
        return (result);
    };
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    EntityHelper.initEntity = function (type, payload, http$$1) {
        var /** @type {?} */ entity = new type();
        for (var /** @type {?} */ p in payload) {
            entity[p] = payload[p];
        }
        entity.http = http$$1;
        return entity;
    };
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    EntityHelper.initEntityCollection = function (type, payload, http$$1) {
        return payload._embedded[Object.keys(payload['_embedded'])[0]]
            .map(function (item) { return EntityHelper.initEntity(type, item, http$$1); });
    };
    /**
     * @template E
     * @param {?} type
     * @param {?} payload
     * @param {?} http
     * @return {?}
     */
    EntityHelper.initPage = function (type, payload, http$$1) {
        var /** @type {?} */ page = new Page(type, http$$1);
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
    };
    /**
     * @param {?} url
     * @return {?}
     */
    EntityHelper.stripTemplatedUrl = function (url) {
        return url.split('{').shift();
    };
    /**
     * @param {?} url
     * @param {?} params
     * @return {?}
     */
    EntityHelper.addHttpParamsToUrl = function (url, params) {
        var /** @type {?} */ _url = url;
        if (!url.includes('?')) {
            _url = _url.concat('?');
        }
        return _url.concat(params.toString());
    };
    return EntityHelper;
}());
var CollectionRef = (function () {
    /**
     * @param {?} url
     * @param {?} http
     */
    function CollectionRef(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    CollectionRef.prototype.entity = function (id) {
        return new EntityRef(this.extendUrl(id), this.http);
    };
    /**
     * @param {?} query
     * @return {?}
     */
    CollectionRef.prototype.filter = function (query) {
        return new FilteredCollectionRef(this.extendUrl(query), this.http);
    };
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    CollectionRef.prototype.get = function (type) {
        var _this = this;
        return this.http.get(this.url)
            .map(function (data) { return EntityHelper.initEntityCollection(type, data, _this.http); });
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    CollectionRef.prototype.add = function (entity) {
        return this.http.post(this.url, EntityHelper.transformForUpdate(entity));
    };
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    CollectionRef.prototype.remove = function (entity) {
        if (entity._links.self) {
            return this.http.delete(entity._links.self.href);
        }
        else {
            return Observable.Observable.throw('Entity not initialised');
        }
    };
    /**
     * @param {?=} size
     * @return {?}
     */
    CollectionRef.prototype.paginate = function (size) {
        return new PaginatedCollectionRef(this.url, size, this.http);
    };
    /**
     * @param {?=} part
     * @return {?}
     */
    CollectionRef.prototype.extendUrl = function (part) {
        var /** @type {?} */ _url = this.url;
        if (!_url.endsWith('/')) {
            _url = _url.concat('/');
        }
        if (part) {
            return _url.concat(part);
        }
        return _url;
    };
    return CollectionRef;
}());
var FilteredCollectionRef = (function () {
    /**
     * @param {?} url
     * @param {?} http
     */
    function FilteredCollectionRef(url, http$$1) {
        this.url = url;
        this.http = http$$1;
        this.queryParams = new http.HttpParams();
    }
    /**
     * @param {?} param
     * @param {?=} reset
     * @return {?}
     */
    FilteredCollectionRef.prototype.queryParam = function (param, reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            this.queryParams = new http.HttpParams();
        }
        this.queryParams = this.queryParams.append(param.key, param.value);
        return this;
    };
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    FilteredCollectionRef.prototype.get = function (type) {
        var _this = this;
        return this.http.get(this.url, { params: this.queryParams })
            .map(function (data) { return EntityHelper.initEntityCollection(type, data, _this.http); });
    };
    /**
     * @param {?=} size
     * @return {?}
     */
    FilteredCollectionRef.prototype.paginate = function (size) {
        return new PaginatedCollectionRef(EntityHelper.addHttpParamsToUrl(this.url, this.queryParams), size, this.http);
    };
    return FilteredCollectionRef;
}());
var PaginatedCollectionRef = (function () {
    /**
     * @param {?} url
     * @param {?} size
     * @param {?} http
     */
    function PaginatedCollectionRef(url, size, http$$1) {
        this.url = url;
        this.size = size;
        this.http = http$$1;
        this.sorting = new http.HttpParams();
        this.sizeParam = new http.HttpParams();
        if (size) {
            this.sizeParam = this.sizeParam.append('size', size.toString());
        }
    }
    /**
     * @param {?} sort
     * @return {?}
     */
    PaginatedCollectionRef.prototype.sort = function (sort) {
        this.sorting = this.sorting.append(sort.property, sort.order);
        return this;
    };
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    PaginatedCollectionRef.prototype.get = function (type) {
        var _this = this;
        var /** @type {?} */ params = this.size ? this.sorting.append('size', this.size.toString()) : this.sorting;
        return this.http.get(this.url, { params: params })
            .map(function (data) { return EntityHelper.initPage(type, data, _this.http); });
    };
    return PaginatedCollectionRef;
}());
var EntityRef = (function () {
    /**
     * @param {?} url
     * @param {?} http
     */
    function EntityRef(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    EntityRef.prototype.get = function (type) {
        var _this = this;
        return this.http.get(this.url)
            .map(function (data) { return EntityHelper.initEntity(type, data, _this.http); });
    };
    return EntityRef;
}());
var RelatedCollectionRef = (function () {
    /**
     * @param {?} url
     * @param {?} http
     */
    function RelatedCollectionRef(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    RelatedCollectionRef.prototype.get = function (type) {
        var _this = this;
        return this.http.get(this.url)
            .map(function (data) { return EntityHelper.initEntityCollection(type, data, _this.http); });
    };
    /**
     * @param {?} size
     * @return {?}
     */
    RelatedCollectionRef.prototype.paginate = function (size) {
        return new PaginatedCollectionRef(this.url, size, this.http);
    };
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    RelatedCollectionRef.prototype.add = function (entity) {
        if (entity._links.self) {
            return this.http.post(this.url, entity._links.self.href, { headers: new http.HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable.Observable.throw('Entity not initialised');
        }
    };
    /**
     * @template E
     * @param {?} entities
     * @return {?}
     */
    RelatedCollectionRef.prototype.set = function (entities) {
        if (entities.every(function (entity) { return entity._links.self; })) {
            var /** @type {?} */ urls = entities.map(function (entity) { return entity._links.self.href; });
            return this.http.put(this.url, urls.join('\n'), { headers: new http.HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable.Observable.throw('Entity not initialised');
        }
    };
    /**
     * @return {?}
     */
    RelatedCollectionRef.prototype.setNull = function () {
        return this.http.delete(this.url);
    };
    return RelatedCollectionRef;
}());
var RelatedEntityRef = (function () {
    /**
     * @param {?} url
     * @param {?} http
     */
    function RelatedEntityRef(url, http$$1) {
        this.url = url;
        this.http = http$$1;
    }
    /**
     * @template E
     * @param {?} type
     * @return {?}
     */
    RelatedEntityRef.prototype.get = function (type) {
        var _this = this;
        return this.http.get(this.url)
            .map(function (data) { return EntityHelper.initEntity(type, data, _this.http); });
    };
    /**
     * @template E
     * @param {?} entity
     * @return {?}
     */
    RelatedEntityRef.prototype.set = function (entity) {
        if (entity._links.self) {
            return this.http.put(this.url, entity._links.self.href, { headers: new http.HttpHeaders().set('Content-Type', 'text/uri-list') });
        }
        else {
            return Observable.Observable.throw('Entity not initialised');
        }
    };
    /**
     * @return {?}
     */
    RelatedEntityRef.prototype.setNull = function () {
        return this.http.delete(this.url);
    };
    return RelatedEntityRef;
}());
var API_URL = new core.InjectionToken('api.uri');
var ApiService = (function () {
    /**
     * @param {?} api_url
     * @param {?} http
     */
    function ApiService(api_url, http$$1) {
        this.api_url = api_url;
        this.http = http$$1;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    ApiService.prototype.collection = function (name) {
        return new CollectionRef(this.getUrl(name), this.http);
    };
    /**
     * @param {?} url
     * @return {?}
     */
    ApiService.prototype.entity = function (url) {
        return new EntityRef(url, this.http);
    };
    /**
     * @param {?=} collection
     * @return {?}
     */
    ApiService.prototype.getUrl = function (collection) {
        var /** @type {?} */ url = this.api_url;
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (collection) {
            return url.concat(collection);
        }
        return url;
    };
    return ApiService;
}());
ApiService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
ApiService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [API_URL,] },] },
    { type: http.HttpClient, },
]; };

exports.HallelujahModule = HallelujahModule;
exports.API_URL = API_URL;
exports.ApiService = ApiService;
exports.Entity = Entity;
exports.EntityHelper = EntityHelper;
exports.Page = Page;
exports.CollectionRef = CollectionRef;
exports.FilteredCollectionRef = FilteredCollectionRef;
exports.PaginatedCollectionRef = PaginatedCollectionRef;
exports.EntityRef = EntityRef;
exports.RelatedCollectionRef = RelatedCollectionRef;
exports.RelatedEntityRef = RelatedEntityRef;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-hallelujah.umd.js.map
