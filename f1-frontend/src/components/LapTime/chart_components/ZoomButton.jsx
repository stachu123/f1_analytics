import * as d3 from "d3";

export const ZoomButton = ({
  svg,
  chart,
  processedData,
  processedData2,
  globalExtents,
  xScale,
  yScale,
  drawLaptimes,
  drawLaptimes2,
  formatTime,
  width,
  iszoomedRef,
}) => {
  svg
    .append("g")
    .attr("transform", `translate(${width - 40}, 10)`)
    .append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "lightgray")
    .attr("rx", 5)
    .attr("ry", 5)
    .on("click", () => {
      if (iszoomedRef.current) {
        svg.selectAll("*").remove();
        iszoomedRef.current = false;
        LaptimesPlot({ data, data2, globalExtents });
      }
      // Reset the zoom state
      iszoomedRef.current = true;

      // Calculate the new yScale domain
      const maxLapTime = Math.max(
        ...[...processedData, ...processedData2].map((d) => d.LapTime)
      );
      yScale.domain([globalExtents.lapTimeExtent[0], maxLapTime - 10]);
      // If needed, adjust the xScale to match the zoomed range (optional)
      xScale.domain(globalExtents.lapNumberExtent); // Ensure the xScale domain remains consistent

      // Remove the old Y-axis
      svg.select(".y-axis").remove();

      // Redraw the y-axis
      yAxisGroup.call(d3.axisLeft(yScale).tickFormat(formatTime));

      // Clear existing data points and lines
      chart.selectAll(".data-point").remove();
      chart.selectAll(".line").remove(); // Remove first dataset line
      chart.selectAll(".line2").remove(); // Remove second dataset line

      // Redraw the data with the updated scales
      if (processedData.length > 0) {
        svg.selectAll(".scatterplot-circle").remove();
        svg.selectAll(".line").remove(); // Remove old line
        drawLaptimes(processedData, chart, xScale, yScale, "#ff9800", "#fff");
      }
      if (processedData2.length > 0) {
        svg.selectAll(".scatterplot-circle2").remove();
        svg.selectAll(".line2").remove(); // Remove old line
        drawLaptimes2(processedData2, chart, xScale, yScale, "#00ff55", "#fff");
      }
    })
    .append("text")
    .attr("x", 15)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", 16)
    .text("zoom");
};
