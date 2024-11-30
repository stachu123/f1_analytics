/**
 * Draws the lap times line chart and scatter plot.
 *
 * @param {Array} dataset
 * @param {d3.Selection} chart
 * @param {d3.Scale} xScale
 * @param {d3.Scale} yScale
 * @param {String} lineColor
 * @param {String} circleColor
 */
import * as d3 from "d3";

export const drawLaptimes = (
  dataset,
  dataset2,
  chart,
  xScale,
  yScale,
  lineColor,
  circleColor
) => {
  // Line generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.LapNumber))
    .y((d) => yScale(d.LapTime))
    .curve(d3.curveStep);

  // Update the line path
  const line = chart.selectAll(".line").data([dataset]);

  // Enter new path
  line
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", lineColor)
    .attr("stroke-width", 2)
    .attr("d", lineGenerator(dataset))
    .attr("stroke-dasharray", function () {
      const totalLength = this.getTotalLength();
      return totalLength;
    })
    .attr("stroke-dashoffset", function () {
      const totalLength = this.getTotalLength();
      return totalLength; // Initially hide the path
    })
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  line
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .attr("d", lineGenerator(dataset));

  // Handle circles (scatter plot)
  const circles = chart.selectAll(".scatterplot-circle").data(dataset);

  // Enter new circles

  const circleEnter = circles
    .enter()
    .append("circle")
    .attr("class", "scatterplot-circle")
    .attr("cx", (d) => xScale(d.LapNumber))
    .attr("cy", (d) => yScale(d.LapTime))
    .attr("r", 0)
    .attr("fill", circleColor)
    .attr("opacity", 0.7)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .transition()
    .delay((d, i) => i * 35) // Delay each circle based on its index
    .duration(500)
    .attr("r", 4);

  // Animate the entering circles
  circleEnter
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx", (d) => xScale(d.LapNumber))
    .attr("cy", (d) => yScale(d.LapTime));

  // Update existing circles
  circles
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx", (d) => xScale(d.LapNumber))
    .attr("cy", (d) => yScale(d.LapTime));

  // Exit and remove circles
  circles.exit().transition().duration(500).attr("r", 0).remove();
};
