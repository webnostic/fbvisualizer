import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-d3-barchart',
  template: `
                <div class="container">
                    <div id="viz"></div>
                </div>
            `
})
export class BarChartComponent {

    private title;

  constructor() {}

  @Input('graphModel') graphModel: any;

  ngOnChanges() {
      if (this.graphModel && this.graphModel !== undefined) {

        let tempColor: any = null;

        const   margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,

                // set the ranges
                x = d3Scale.scaleBand()
                    .range([0, width])
                    .padding(0.1),

                y = d3Scale.scaleLinear()
                    .range([height, 0]);

        const colors = (<any>d3Scale.scaleLinear())
                // .domain([0, sentimentCounts.length * .33,
                //     sentimentCounts.length * .66,
                //     sentimentCounts.length
                //     ])
                    .range(['#B58929', '#C61C6F', '#268BD2', '#85992C']);
        const tooltip = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        const svg = d3.select('#viz').append('div').attr('id', 'a' + this.graphModel.id)
            // .append('text').attr('text-anchor', 'middle').attr('x', 0).attr('y', '.3em').text(this.graphModel.id)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          // Scale the range of the data in the domains
          x.domain(this.graphModel['sentiments'].map(it => it['sentiment']));
          y.domain([0,
            d3.max(this.graphModel['sentiments'],
            function(gModel) {
                return gModel['count'];
            })]);

          // append the rectangles for the bar chart
          const barChart = svg.selectAll('.bar')
            .data(this.graphModel['sentiments'])
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('x', function(gModel) { return x(gModel['sentiment']); })
              .attr('width', x.bandwidth())
              .attr('y', function(gModel) { return y(gModel['count']); })
              .attr('height', function(gModel) { return height - y(gModel['count']); })

              .on('mouseover', function(gModel) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);

                    tooltip.html(gModel['count'])
                        .style('left', ((<any>d3.event).pageX - 35) + 'px')
                        .style('top', ((<any>d3.event).pageY - 30) + 'px');

                    tempColor = this.style.fill;
                    d3.select(this)
                        .style('fill', 'yellow');
                })

                .on('mouseout', function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                    d3.select(this)
                        .style('fill', tempColor);
                });

            // add the x Axis
            svg.append('g')
              .attr('transform', 'translate(0,' + height + ')')
              .call((<any>d3).axisBottom(x));

            // add the y Axis
            svg.append('g')
              .call((<any>d3).axisLeft(y))
              .append('text')
                .attr('y', 6)
                .attr('dy', '-2em')
                .style('text-anchor', 'middle')
                .text(this.graphModel['id']);

            svg.append('text')
            .attr('text-anchor', 'top')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height) + '))')
            .text(this.graphModel.id);


            // doesn't work
            barChart.selectAll('.bar').transition()
                .attr('height', function(gModel) {
                    return y(gModel['count']);
                })
                .attr('y', function(gModel) {
                    return height - y(gModel['count']);
                })
                .delay(function(d, i) {
                    return i * 50;
                })
                .duration(3000)
                .ease((<any>d3).easeBounceOut);
        }
    }
}
