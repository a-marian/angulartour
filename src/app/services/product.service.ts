import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {Category} from "../common/category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/categories';

  constructor(private httpClient: HttpClient) {}

    getCategories(): Observable<Category[]> {
      return this.httpClient.get<Category[]>(this.categoryUrl);
    }

  getProduct(theProductId: number): Observable<Product> {
    //to build url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    console.log(this.httpClient.get<Product>(productUrl));
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                          thePageSize: number,
                          theCategoryId: number): Observable<Product[]> {
    //need to build URL based on categoryId, page and size
    const searchUrl = `${this.baseUrl}?categoryId=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<Product[]>(searchUrl);

  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/?categoryId=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string | Observable<Product>[]) {
    const searchUrl = `${this.baseUrl}?productName=${theKeyword}`;
    return this.getProducts(searchUrl);
    }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword?: string | null): Observable<GetResponseProducts> {
    //need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}?name=${theKeyword}`;
      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  private getProducts(searchUrl : string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

}

  interface GetResponseProducts {
    _embedded: {
      products: Product[];
    },
       page: {
          size:number,
          totalElements: number,
          totalPages: number,
          number: number
        }
  }

  interface GetResponseCategory {
    _embedded: {
      categories: Category[];
    }
  }
