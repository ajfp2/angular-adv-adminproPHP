import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

    @Input() title: string = 'Sin titulo';
    @Input('labels') doughnutChartLabels: Label[] = ['Label 1', 'Label 2', 'Label 3'];
    @Input('data') doughnutChartData: MultiDataSet = [[350, 450, 100]];

    public colors: Color[] = [
        { backgroundColor: ['#6857e6', '#009f33', '#f02059']}
    ];
    // public doughnutChartType: ChartType = 'doughnut';

}
