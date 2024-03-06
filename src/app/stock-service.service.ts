import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockServiceService {

  constructor( private http: HttpClient) { }

  getDataTest():Observable<any> {
    return this.http.get<any>("https://localhost:7047/getall/VN30");
  }

  getStockByCode(code: string): Observable<any> {
    return this.http.get<any>("https://localhost:7047/"+code)
  }
}
