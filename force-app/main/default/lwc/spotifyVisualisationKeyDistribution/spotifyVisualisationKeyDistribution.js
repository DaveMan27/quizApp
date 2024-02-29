//import { LightningElement, api } from 'lwc';

//export default class SpotifyVisualisationKeyDistribution extends LightningElement {
    /*@api analysis = [];
    connectedCallback() {
        console.log('Analysis: ', JSON.parse(JSON.stringify(this.analysis)));
    }*/

  // libsD3.js
  /* global d3 */
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import D3 from "@salesforce/resourceUrl/d3_min";
import DATA from "@salesforce/resourceUrl/data";
import STYLES from "@salesforce/resourceUrl/styles";

export default class SpotifyVisualisationKeyDistribution extends LightningElement {
  svgWidth = 400;
  svgHeight = 400;

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
      const svg = d3.select(this.template.querySelector("svg.d3"));
      console.log(svg);
    const width  = this.svgWidth;
    const height = this.svgHeight;
    const color  = d3.scaleOrdinal(d3.schemeDark2);
      console.log(data);

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => {
          return d.id;
        }),
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => {
        return Math.sqrt(d.value);
      });

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => {
        return color(d.group);
      })
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node.append("title").text((d) => {
      return d.id;
    });

    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }
}


