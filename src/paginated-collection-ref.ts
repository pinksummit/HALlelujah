import { Page } from './page';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Entity } from './entity';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SortOptions } from './sort-options';

export class PaginatedCollectionRef {
  private sorting = new HttpParams();
  private sizeParam = new HttpParams();

  constructor(private url: string, private size: number, private http: HttpClient) {
    if (size) {
      this.sizeParam = this.sizeParam.append('size', size.toString());
    }
  }

  sort(sort: SortOptions): PaginatedCollectionRef {
    this.sorting = this.sorting.append(sort.property, sort.order);
    return this;
  }

  get<E extends Entity>(type: new () => E): Observable<Page<E>> {
    const params = this.size ? this.sorting.append('size', this.size.toString()) : this.sorting;
    return this.http
      .get<object>(this.url, { params })
      .pipe(
        map<object, Page<E>>(data => Page.initPage(type, data, this.http))
      );
  }
}
