import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockServiceService {

  constructor( private http: HttpClient) { }
  baseUrl = "https://chungdvhe160135.bsite.net/";

  getStocksToday():Observable<any> {
    return this.http.get<any>(this.baseUrl+"getall/VN30");
  }

  getStockByCode(code: string): Observable<any> {
    return this.http.get<any>(this.baseUrl+code)
  }

  getExport(name:string): Observable<any> {
    return this.http.get<any>(this.baseUrl+name);
  }

  export(name:string): Observable<any> {
    return this.http.get(this.baseUrl+"StockAnalysis/api/export?ids="+name,
        {responseType: 'blob'});
}

  predict(name:string): Observable<any> {
    return this.http.get(this.baseUrl+"StockAnalysis/api/predict?id="+name);
  }

}
