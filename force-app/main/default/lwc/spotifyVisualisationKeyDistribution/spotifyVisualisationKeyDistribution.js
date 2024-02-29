import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import D3 from "@salesforce/resourceUrl/d3_min";
import DATA from "@salesforce/resourceUrl/data";
import STYLES from "@salesforce/resourceUrl/styles";

export default class SpotifyVisualisationKeyDistribution extends LightningElement {
     
   svgWidth     = 928;
   svgHeight    = 500;
   marginTop    = 20;
   marginRight  = 0;
   marginBottom = 30;
   marginLeft   = 40;

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
  

  // Create the horizontal scale and its axis generator.
  const x = d3.scaleBand()
  .domain(data.sort((a, b) => b.frequency - a.frequency).map(d => d.key))
  .range([this.marginLeft, this.svgWidth - this.marginRight])
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);


  // Create the vertical scale.
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.frequency)]).nice()
    .range([this.svgHeight - this.marginBottom, this.marginTop]);

  // Create the SVG container and call the zoom behavior.
      const svg = d3.select(this.template.querySelector('svg'));
      svg.attr("viewBox", [0, 0, this.svgWidth, this.svgHeight])
        .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .attr("style", "max-width: 100%; height: auto;")
      .call(zoom);

  // Append the bars.
  svg.append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.frequency))
      .attr("height", d => y(0) - y(d.frequency))
      .attr("width", x.bandwidth());

  // Append the axes.
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${this.svgHeight - this.marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());

  return svg.node();

  function zoom(svg) {
    const extent = [[this.marginLeft, this.marginTop], [this.svgWidth - this.marginRight, this.svgHeight - this.marginTop]];

    svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed));

    function zoomed(event) {
      x.range([this.marginLeft, this.svgWidth - this.marginRight].map(d => event.transform.applyX(d)));
      svg.selectAll(".bars rect").attr("x", d => x(d.key)).attr("width", x.bandwidth());
      svg.selectAll(".x-axis").call(xAxis);
    }
  }
    
  }
}


