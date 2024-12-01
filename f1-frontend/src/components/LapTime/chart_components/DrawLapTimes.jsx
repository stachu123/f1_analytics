import * as d3 from "d3";

export const drawLaptimes = (
  dataset,
  chart,
  xScale,
  yScale,
  lineColor,
  circleColor
) => {
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.LapNumber))
    .y((d) => yScale(d.LapTime))
    .curve(d3.curveCardinal);

  // Update the line path

  const line = chart.selectAll(".line").data([dataset]);
  line.remove();
  chart.selectAll(".line").remove();
  line.join(
    (enter) =>
      enter
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
        .attr("stroke-dashoffset", 0),
    (update) =>
      update
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("d", lineGenerator(dataset))
        .attr("stroke-dasharray", function () {
          const totalLength = this.getTotalLength();
          return totalLength;
        })
        .attr("stroke-dashoffset", 0),
    (exit) => exit.remove()
  );
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
    .attr("r", 2);

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
  const lastDataPoint = dataset[dataset.length - 1];

  chart
    .append("text")
    .attr("class", "driver-name-label")
    .attr("x", xScale(lastDataPoint.LapNumber) + 20) // Slight offset for clarity
    .attr("y", yScale(lastDataPoint.LapTime))
    .attr("fill", lineColor)
    .attr("font-size", 16)
    .text(lastDataPoint.Driver);
};

export const drawLaptimes2 = (
  dataset,
  chart,
  xScale,
  yScale,
  lineColor,
  circleColor
) => {
  const lineGenerator2 = d3
    .line()
    .x((d) => xScale(d.LapNumber))
    .y((d) => yScale(d.LapTime))
    .curve(d3.curveCardinal);

  // Update the line path
  const line2 = chart.selectAll(".line2").data([dataset]);

  // Enter new path
  line2
    .enter()
    .append("path")
    .attr("class", "line2")
    .attr("fill", "none")
    .attr("stroke", lineColor)
    .attr("stroke-width", 2)
    .attr("d", lineGenerator2(dataset))
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

  line2
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .attr("d", lineGenerator2(dataset));

  // Handle circles (scatter plot)
  const circles2 = chart.selectAll(".scatterplot-circle2").data(dataset);

  // Enter new circles

  const circleEnter2 = circles2
    .enter()
    .append("circle")
    .attr("class", "scatterplot-circle2")
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
    .attr("r", 2);

  // Animate the entering circles
  circleEnter2
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx", (d) => xScale(d.LapNumber))
    .attr("cy", (d) => yScale(d.LapTime));

  // Update existing circles
  circles2
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx", (d) => xScale(d.LapNumber))
    .attr("cy", (d) => yScale(d.LapTime));

  // Exit and remove circles
  circles2.exit().transition().duration(500).attr("r", 0).remove();
  const lastDataPoint = dataset[dataset.length - 1];
  chart
    .append("text")
    .attr("class", "driver-name-label2")
    .attr("x", xScale(1)) // Slight offset for clarity
    .attr("y", dataset[dataset.length - 1].LapTime)
    .attr("fill", lineColor)
    .attr("font-size", 16)
    .text(lastDataPoint.Driver);
};
