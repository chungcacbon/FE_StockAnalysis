import { StockServiceService } from './../stock-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ChartOptions } from '../dashboard/dashboard.component';
import { ChartComponent } from 'ng-apexcharts';
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



@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})



export class StockDetailComponent implements OnInit {
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  public chartAreaSparkline3Options: Partial<ChartOptions>;
  public chartLineSparkline3Options: Partial<ChartOptions>;
  public chartBarSparkline3Options: Partial<ChartOptions>;
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
    constructor(private dataService: DataServiceService, private stockService: StockServiceService) {
        this.data = [ this.dataService.getGoog(), this.dataService.getMsft() ];

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
              data: this.randomizeArray(sparkLineData)
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

        this.chartLineSparkline3Options = {
          series: [
            {
              name: "chart-line-sparkline",
              data: this.randomizeArray(sparkLineData.slice(0, 10))
            }
          ]
        };


        this.chartBarSparkline3Options = {
          series: [
            {
              name: "chart-bar-sparkline",
              data: this.randomizeArray(sparkLineData.slice(0, 10))
            }
          ]
        };
  }

  ngOnInit(): void {
    this.stockService.getDataTest().subscribe(data => {console.log(data);})
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

}
