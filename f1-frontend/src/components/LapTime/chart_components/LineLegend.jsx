import * as d3 from "d3";

export const LineLegend1 = (dataset1, svg, width, lineColor1) => {
  svg
    .append("circle")
    .attr("cx", width / 2 - 20)
    .attr("cy", 10)
    .attr("r", 6)
    .attr("class", "legend-circle")
    .style("fill", lineColor1);
  svg
    .append("text")
    .attr("x", width / 2 - 10)
    .attr("y", 11)
    .text(dataset1[0].Driver)
    .style("fill", lineColor1)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
};

export const LineLegend2 = (dataset1, svg, lineColor1) => {
  svg
    .append("circle")
    .attr("cx", 100)
    .attr("cy", 200)
    .attr("r", 6)
    .style("fill", "linecolor1");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 160)
    .attr("r", 6)
    .style("fill", "#linecolor2");
  svg
    .append("text")
    .attr("x", 220)
    .attr("y", 130)
    .text(dataset1[0].Driver)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 220)
    .attr("y", 160)
    .text(dataset2[0].Driver)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
};
