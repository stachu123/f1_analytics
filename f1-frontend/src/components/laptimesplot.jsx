import { useRef, useEffect } from "react";
import * as d3 from "d3";

const LaptimesPlot = ({ data, globalExtents }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear the SVG on each update

    const width = svg.node().parentNode.clientWidth || 800; // Fallback width
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse lap time from string to seconds
    const parseLapTime = (lapTime) => {
      if (typeof lapTime !== "string") {
        return null;
      }
      if (!lapTime.trim()) return null;

      const timeMatch = lapTime.match(/(\d+) days? (\d+):(\d+):(\d+)\.(\d+)/);
      if (!timeMatch) return null;

      const [, days, hours, minutes, seconds, milliseconds] = timeMatch.map(
        (v, i) => (i === 0 ? v : Number(v))
      );

      const totalSeconds =
        days * 24 * 60 * 60 +
        hours * 60 * 60 +
        minutes * 60 +
        seconds +
        milliseconds / 1000000;

      return totalSeconds;
    };

    const processedData = data
      .map((d) => ({
        LapNumber: +d.LapNumber,
        LapTime: parseLapTime(d.LapTime),
      }))
      .filter((d) => d.LapTime !== null);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(globalExtents.lapNumberExtent)
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(globalExtents.lapTimeExtent)
      .range([innerHeight, 0])
      .nice();

    /**
     * Formats a time in seconds to a string of the form mm:ss.cc
     * @param {number} timeInSeconds - The time in seconds to format
     * @returns {string} A string of the form mm:ss.cc
     */
    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.round((timeInSeconds % 60) * 100) / 100;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toFixed(2)
        .padStart(5, "0")}`;
    };

    const xAxis = d3.axisBottom(xScale).ticks(processedData.length);
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 35)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("Lap Number");

    chart
      .append("g")
      .call(yAxis)
      .append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -60)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Lap Time (MM:SS.SS)");

    // Line generator
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.LapNumber))
      .y((d) => yScale(d.LapTime))
      .curve(d3.curveStep);

    // Update the line path
    const line = chart.selectAll(".line").data([processedData]);

    // Enter new path
    line
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(processedData))
      .transition()
      .duration(1000) // Animate transition
      .ease(d3.easeLinear)
      .attr("d", lineGenerator(processedData));

    // Update existing path
    line
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("d", lineGenerator(processedData));

    // Handle circles (scatter plot)
    const circles = chart.selectAll(".scatterplot-circle").data(processedData);

    // Enter new circles

    const circleEnter = circles
      .enter()
      .append("circle")
      .attr("class", "scatterplot-circle")
      .attr("cx", (d) => xScale(d.LapNumber))
      .attr("cy", (d) => yScale(d.LapTime))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5);

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
  }, [data, globalExtents]);

  return <svg ref={svgRef}></svg>;
};

export default LaptimesPlot;
