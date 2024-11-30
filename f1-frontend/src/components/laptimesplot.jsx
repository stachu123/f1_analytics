import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { drawLaptimes } from "./DrawLapTimes";

const LaptimesPlot = ({ data = [], data2 = [], globalExtents }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear the SVG

    const width = svg.node().parentNode?.getBoundingClientRect().width || 800;
    const height = width * 0.4; // Maintain aspect ratio
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

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

    const processData = (rawData) => {
      return rawData
        .map((d) => ({
          LapNumber: +d.LapNumber,
          LapTime: parseLapTime(d.LapTime),
        }))
        .filter((d) => d.LapTime !== null);
    };
    const processedData = processData(data);
    const processedData2 = processData(data2);

    console.log("processedData:", processedData);
    console.log("processedData2:", processedData2);

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

    drawLaptimes(
      processData,
      processedData2,
      chart,
      xScale,
      yScale,
      "#ff0000",
      "#0000ff"
    );
  }, [data, data2, globalExtents]);

  return <svg ref={svgRef}></svg>;
};

export default LaptimesPlot;
