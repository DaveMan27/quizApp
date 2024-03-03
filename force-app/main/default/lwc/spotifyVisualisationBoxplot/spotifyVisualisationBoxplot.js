import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3_min';
import STYLES from '@salesforce/resourceUrl/styles';

export default class SpotifyVisualisationBoxplot extends LightningElement {
         svgWidth      = 928;
         svgHeight     = 500;
         d3Initialized = false;
    @api analysis      = [];

    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }

        Promise.all([loadScript(this, D3), loadStyle(this, STYLES)])
            .then(() => {
                this.initializeD3(this.analysis);
                console.log(this.analysis);
            })
            .catch(error => {
                this.handleError(error);
            });

        this.d3Initialized = true;
    }

    initializeD3(data) {
              data       = JSON.parse(data);
        const svgElement = this.template.querySelector('svg');
        const svg        = d3.select(svgElement);
        const margin     = { top: 20, right: 20, bottom: 30, left: 40 };
        const width      = this.svgWidth - margin.left - margin.right;
        const height = this.svgHeight - margin.top - margin.bottom;
        
  const n    = width / 40;
  const bins = d3.bin()
    .thresholds(n)
    .value(d => d.carat)
  (diamonds)
    .map(bin => {
      bin.sort((a, b) => a.price - b.price);
      const values = bin.map(d => d.price);
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = d3.quantile(values, 0.25);
      const q2 = d3.quantile(values, 0.50);
      const q3 = d3.quantile(values, 0.75);
      const iqr = q3 - q1; // interquartile range
      const r0 = Math.max(min, q1 - iqr * 1.5);
      const r1 = Math.min(max, q3 + iqr * 1.5);
      bin.quartiles = [q1, q2, q3];
      bin.range = [r0, r1];
      bin.outliers = bin.filter(v => v.price < r0 || v.price > r1); // TODO
      return bin;
    })

  // Prepare the positional scales.
  const x = d3.scaleLinear()
    .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
    .rangeRound([marginLeft, width - marginRight])
  const y = d3.scaleLinear()
    .domain([d3.min(bins, d => d.range[0]), d3.max(bins, d => d.range[1])]).nice()
    .range([height - marginBottom, marginTop])

  // Create the SVG container.
    svg.attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
      .attr("text-anchor", "middle");

  // Create a visual representation for each bin.
  const g = svg.append("g")
    .selectAll("g")
    .data(bins)
    .join("g");

  // Range.
  g.append("path")
      .attr("stroke", "currentColor")
      .attr("d", d => `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}
      `);

  // Quartiles.
  g.append("path")
      .attr("fill", "#ddd")
      .attr("d", d => `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z
      `);

  // Median.
  g.append("path")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("d", d => `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}
      `);

  // Outliers, with a bit of jitter.
  g.append("g")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .attr("transform", d => `translate(${x((d.x0 + d.x1) / 2)},0)`)
    .selectAll("circle")
    .data(d => d.outliers)
    .join("circle")
      .attr("r", 2)
      .attr("cx", () => (Math.random() - 0.5) * 4)
      .attr("cy", d => y(d.price));

  // Append the x axis.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(n).tickSizeOuter(0));

  // Append the y axis.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove());

  //return svg.node();
        

}
    
    handleError(error) {
        console.error('Error:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading D3 or data',
                message: error.message,
                variant: 'error',
            }),
        );
    }
}
