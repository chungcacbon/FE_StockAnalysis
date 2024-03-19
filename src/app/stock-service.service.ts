import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockServiceService {

  constructor( private http: HttpClient) { }

  getStocksToday():Observable<any> {
    return this.http.get<any>("https://localhost:7047/getall/VN30");
  }

  getStockByCode(code: string): Observable<any> {
    return this.http.get<any>("https://localhost:7047/"+code)
  }

  getExport(name:string): Observable<any> {
    return this.http.get<any>("https://localhost:7047/"+name);
  }

  export(name:string): Observable<any> {
    return this.http.get("https://localhost:7047/StockAnalysis/api/export?ids="+name,
        {responseType: 'blob'});
}

  predict(name:string): Observable<any> {
    return this.http.get("https://localhost:7047/StockAnalysis/api/predict?id="+name);
  }

}
