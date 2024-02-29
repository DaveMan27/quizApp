import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import D3 from "@salesforce/resourceUrl/d3_min";
import DATA from "@salesforce/resourceUrl/data";
import STYLES from "@salesforce/resourceUrl/styles";

export default class SpotifyVisualisationKeyDistribution extends LightningElement {

   @api svgWidth  = 928;
   @api svgHeight = 500; 

  d3Initialized = false;

    renderedCallback() {
   
    if (this.d3Initialized) {
        return;
    }
    this.d3Initialized = true;

      // Load D3 and styles first
        Promise.all([loadScript(this, D3), loadStyle(this, STYLES)])
            .then(() => {
                                    // After D3 and styles are loaded, fetch your data
                return fetch(DATA)  // Assuming DATA is a URL string
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();  // Parse JSON data from the response
                    })
                    .then(data => {
                                                // Now that we have the data, initialize D3 with it
                        this.initializeD3(data);  // Pass data to your D3 initialization function
                    });
            })
            .catch((error) => {
                console.error("Error loading resources or fetching data", error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error",
                        message: error.message,
                        variant: "error",
                    }),
                );
            });
    }   




  initializeD3(data) {
      // Example adopted from https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
    
   
      const svg = d3.select(this.template.querySelector('svg'));
      const margin = { top: 20, right: 0, bottom: 30, left: 40 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      // Scales and axes setup...
      const x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.1)
          .domain(data.map(d => d.key));

      const y = d3.scaleLinear()
          .rangeRound([height, 0])
          .domain([0, d3.max(data, d => d.frequency)]);

      // Append SVG and groups, applying transformations...
      svg.attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Example: Appending bars...
      svg.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.key))
          .attr('y', d => y(d.frequency))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.frequency));

  // Append the axes.
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${this.svgHeight - margin.bottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());

  return svg.node();

  function zoom(svg) {
    const extent = [[margin.left, margin.top], [this.svgWidth - margin.right, this.svgHeight - margin.top]];

    svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed));

    function zoomed(event) {
      x.range([margin.left, this.svgWidth - margin.right].map(d => event.transform.applyX(d)));
      svg.selectAll(".bars rect").attr("x", d => x(d.key)).attr("width", x.bandwidth());
      svg.selectAll(".x-axis").call(xAxis);
    }
  }
    
  }
}


