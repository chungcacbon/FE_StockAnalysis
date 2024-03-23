import { StockServiceService } from './../stock-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ChartOptions } from '../dashboard/dashboard.component';
import { ChartComponent } from 'ng-apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap, forkJoin, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { ThisReceiver } from '@angular/compiler';
const sparkLineData = [
  47,
  45,
  54,
  38,
  56,
  24,
  65,
  31,
  37,
  39,
  54,
  38,
  56,
  24,
  65,
  31,
  37,
  39,
  62,
  51,
  35,
  41,
  35,
  27,
  93,
  53,
  61,
  27,
  54,
  43,
  19,
  54,
  38,
  56,
  24,
  65,
  31,
  37,
  39,
  62,
  51,
  35,
  41,
  35,
  27,
  93,
  53,
  61,
  27,
  54,
  43,
  19,
  62,
  51,
  35,
  41,
  35,
  27,
  93,
  53,
  61,
  27,
  54,
  43,
  19,
  46
];
let firstStockHistoryData :any;
let secondStockHistoryData :any;
let firstStockCode :string;
let secondStockCode :string;
let listTopStockName :string[] = ["FPT","GVR","PLX","SSI","VCB"];
let top5Stocks :any[];
@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})



export class StockDetailComponent implements OnInit {
  allSymStocks :string[] = [];
  selectedStock1:string ="";
  selectedStock2:string ="";
  display = "none";
  stockToday: any;
  topStocks:any[]=[];
  isPopupOpen: boolean = false;
  predictData:any;
  public listTopStockInfo : any[] = [];
  public topStockChart : Partial<ChartOptions>[] = [];
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  public geminiResponse :string = "";
  public isAskingGemini: boolean = false;

  public chartAreaSparkline3Options?: Partial<ChartOptions>;
  public chartAreaSparkline3Options1?: Partial<ChartOptions>;
  public chartAreaSparkline3Options2?: Partial<ChartOptions>;
  public chartAreaSparkline3Options3?: Partial<ChartOptions>;
  public chartAreaSparkline3Options4?: Partial<ChartOptions>;
  public commonAreaSparlineOptions: Partial<ChartOptions> = {
    chart: {
      type: "area",
      height: 60,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      curve: "straight"
    },
    fill: {
      opacity: 0.3
    },
    yaxis: {
      min: 0
    }
  };

  public data: any;
    constructor(private dataService: DataServiceService, private stockService: StockServiceService, private route: ActivatedRoute, private router: Router) {

     // this.getTopStock();
  }

    togglePopup(): void {
        this.stockService.predict(firstStockCode).subscribe(data => {this.predictData = data;
          console.log(this.predictData)
        });
        this.isPopupOpen = !this.isPopupOpen;
    }

  ngOnInit(): void {

    this.route.params.pipe(

      concatMap((params : any) =>{
        let numberOfParams:number = Object.keys(params).length;
        console.log(numberOfParams)
        if(numberOfParams ==1){
          firstStockCode = params['param'];
          this.stockService.getStockByCode(firstStockCode).subscribe(data =>{
            firstStockHistoryData = data.map((data:any)=>{
              return {...data, time: new Date(data.time)}})
              firstStockHistoryData.title = firstStockCode;
              this.getStockToday(firstStockCode);
              this.data = [firstStockHistoryData];
          });
        }
        if(numberOfParams == 2){
          firstStockCode = params['param1'];
          secondStockCode = params['param2'];
          return forkJoin({
            data1: this.stockService.getStockByCode(firstStockCode),
            data2: this.stockService.getStockByCode(secondStockCode)
          }).pipe(
            tap(({data1, data2}) => {
              firstStockHistoryData = data1.map((data:any)=>{
                return {...data, time: new Date(data.time)}})
                firstStockHistoryData.title = firstStockCode;
                this.getStockToday(firstStockCode);
              secondStockHistoryData = data2.map((data:any)=>{
                return {...data, time: new Date(data.time)}})
                secondStockHistoryData.title = secondStockCode;
              this.data = [firstStockHistoryData, secondStockHistoryData];
            })
          )
      }
      else{
        return of(null);
      }
    })

    ).subscribe(data=>{})
    // this.route.params.subscribe(params => {
    //   let numberOfParams:number = Object.keys(params).length;
    //   if (numberOfParams == 1){

    //     this.stockService.getStockByCode("").subscribe(stock => {
    //       firstStockHistoryData = stock.map((data:any)=>{
    //         return {...data, time: new Date(data.time)}})
    //         firstStockHistoryData.title="ACB"
    //         this.data = [firstStockHistoryData];
    //         console.log(firstStockHistoryData)
    //      });
    //   }
    //   if(numberOfParams == 2){

    //   }
    // });

   /// this.stockService.getDataTest().subscribe(data => {console.log(data);})
  }

  public randomizeArray(arg:any): number[] {

    var array = arg.slice();
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  public getStockToday(name:string):void{
    this.stockService.getStocksToday().subscribe(stock => {
      this.allSymStocks = stock.map((stock : any) => stock.sym);
      this.stockToday = stock.find((item:any) =>item.sym == name);

      for(let i = 0; i < 6; i++) {
        let sym = this.randomStock(this.allSymStocks);
        this.listTopStockInfo?.push(stock.find((item:any) =>item.sym == sym));
        this.stockService.getStockByCode(sym).subscribe(data => {

          this.topStocks.push(data.slice(Math.max(data.length - 20, 0)).map((item : any)=>{
            return item.close;
          }))
          console.log(this.topStocks)
          if(this.topStocks[i] != null ){

            let chartAreaSparklineItemOptions : Partial<ChartOptions> = {
              series: [
                {
                  data: this.topStocks[i]
                }
              ],
              colors: ["#67D0BF"],
              title: {
                text: "$135,965",
                offsetX: 0,
                style: {
                  fontSize: "24px"
                }
              },
              subtitle: {
                text: "Profits",
                offsetX: 0,
                style: {
                  fontSize: "14px"
                }
              }
            };
            this.topStockChart?.push(chartAreaSparklineItemOptions);
          }
          console.log(this.topStockChart);
          console.log(this.topStocks)

        });


      }


    })
  }

  exportStockReport(){
    this.exportPdf();

  }

  exportPdf() {
    this.stockService.export(firstStockCode).subscribe(data => saveAs(data, `report.csv`));
}


  getTopStock():any {

      listTopStockName.forEach((item:any) =>{
        this.stockService.getStockByCode(item).subscribe(data => {

          this.topStocks.push(data.slice(Math.max(data.length - 20, 0)).map((item : any)=>{
            return item.close;
          }))
          console.log(this.topStocks)
          console.log(this.topStocks)
          this.setUpTopStocks()
        });
      })

  }

  // async initialSparrAreaChart() {
  //   await this.getTopStock();
  //   await this.setUpTopStocks();
  //   // Code after the first and second async operations
  // }

  setUpTopStocks() :any{
    console.log(2222222222);
    console.log(this.topStocks[0])
    window.Apex = {
      stroke: {
        width: 2
      },
      markers: {
        size: 0
      },
      tooltip: {
        fixed: {
          enabled: true
        }
      }
    };

    this.chartAreaSparkline3Options = {
      series: [
        {
          data: this.topStocks[0]
        }
      ],
      colors: ["#67D0BF"],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline3Options1 = {
      series: [
        {
          data: this.topStocks[1]
        }
      ],
      colors: ["#67D0BF"],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline3Options2 = {
      series: [
        {
          data: this.topStocks[2]
        }
      ],
      colors: ["#67D0BF"],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline3Options3 = {
      series: [
        {
          data: this.topStocks[3]
        }
      ],
      colors: ["#67D0BF"],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline3Options4 = {
      series: [
        {
          data: this.topStocks[4]
        }
      ],
      colors: ["#67D0BF"],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };
  }


  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }

  compareStock(){
    if(this.selectedStock1 !=null && this.selectedStock2 !=null){
      this.router.navigate(['/detail',this.selectedStock1, this.selectedStock2]);
    }else{
      alert("Please enter choosing 2 stock to compare");
    }
  }

  moveToHome(){
    this.router.navigate(['/dashboard']);
  }

  randomStock(listStock : string[]):string{
  const randomIndex = Math.floor(Math.random() * listStock.length);
  return listStock[randomIndex];
  }
  askGemini(){
    this.isAskingGemini = true;
    this.stockService.predict_gemini(firstStockCode).subscribe(data=>{
      console.log(data.candidates[0].content.parts[0].text)
      try{
        this.geminiResponse = data.candidates[0].content.parts[0].text;
      }catch(e){
        this.geminiResponse = "Error orcurs during ask Gemini please check your connection and try again.";
      }

    });
  }

  CloseGeminiResponse(){
    this.isAskingGemini = false;
  }

}
