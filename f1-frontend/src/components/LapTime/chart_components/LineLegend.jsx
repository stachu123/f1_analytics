import * as d3 from "d3";

export const LineLegend1 = (dataset1, svg, width, lineColor1) => {
  svg
    .append("circle")
    .attr("cx", width / 2 - 40)
    .attr("cy", 10)
    .attr("r", 6)
    .style("fill", lineColor1);
  svg
    .append("text")
    .attr("x", width / 2 - 30)
    .attr("y", 14)
    .attr("class", "legend-text")
    .text(dataset1[0].Driver)
    .style("fill", lineColor1)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
};

export const LineLegend2 = (dataset, svg, width, lineColor2) => {
  svg
    .append("circle")
    .attr("cx", width / 2 + 20)
    .attr("cy", 10)
    .attr("r", 6)
    .style("fill", lineColor2);
  svg
    .append("text")
    .attr("x", width / 2 + 30)
    .attr("y", 14)
    .attr("class", "legend-text2")
    .text(dataset[0].Driver)
    .style("font-size", "15px")
    .style("fill", lineColor2)
    .attr("alignment-baseline", "middle");
};
