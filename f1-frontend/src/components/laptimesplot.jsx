import { useRef, useEffect } from "react";
import * as d3 from "d3";

const LaptimesPlot = (props) => {
  const width = 1000;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous content before re-rendering
    svg.selectAll("*").remove();

    // Create chart container
    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse LapTime (convert "0 days 00:01:28.179000" to seconds)
    const parseLapTime = (lapTime) => {
      if (!lapTime) return null; // Handle missing values
      const timeMatch = lapTime.match(/(\d+):(\d+):([\d.]+)/);
      if (!timeMatch) return null; // Return null if parsing fails
      const [, hours, minutes, seconds] = timeMatch.map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    // Prepare the data
    const processedData = props.data
      .map((d) => ({
        LapNumber: +d.LapNumber,
        LapTime: parseLapTime(d.LapTime),
        Driver: d.Driver,
      }))
      .filter((d) => d.LapTime !== null); // Remove invalid data

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.LapNumber)])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(processedData, (d) => d.LapTime) - 10,
        d3.max(processedData, (d) => d.LapTime),
      ])
      .range([innerHeight, 0])
      .nice();

    // Create axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(10)
      .tickFormat((d) => d3.format(".1f")(d / 60) + " min"); // Format in minutes

    // Render axes
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
      .attr("y", -40)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Lap Time (Minutes)");

    // Render scatterplot
    chart
      .selectAll(".scatterplot-circle")
      .data(processedData)
      .join("circle")
      .attr("class", "scatterplot-circle")
      .attr("cx", (d) => xScale(d.LapNumber))
      .attr("cy", (d) => yScale(d.LapTime))
      .attr("r", 6)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5);
  }, [props.data, innerWidth, innerHeight]);

  return <svg ref={svgRef}></svg>;
};

export default LaptimesPlot;
