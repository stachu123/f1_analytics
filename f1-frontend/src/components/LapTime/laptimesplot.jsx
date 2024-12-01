import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { drawLaptimes, drawLaptimes2 } from "./chart_components/DrawLapTimes";

const LaptimesPlot = ({ data = [], data2 = [], globalExtents }) => {
  const svgRef = useRef();
  const prevDataRef = useRef([]); // Store previous `data`
  const prevData2Ref = useRef([]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // svg.selectAll("*").remove(); // Clear the SVG

    const width = svg.node().parentNode?.getBoundingClientRect().width || 800;
    const height = width * 0.4; // Maintain aspect ratio
    const margin = { top: 20, right: 80, bottom: 40, left: 60 };
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
    console.log(data);
    const processData = (rawData) => {
      return rawData
        .map((d) => ({
          LapNumber: +d.LapNumber,
          LapTime: parseLapTime(d.LapTime),
          Driver: d.Driver,
          Team: d.Team,
        }))
        .filter((d) => d.LapTime !== null);
    };
    const isSameData = (newData, oldData) => {
      if (newData.length !== oldData.length) return false;
      return newData.every(
        (item, index) =>
          item.LapNumber === oldData[index].LapNumber &&
          item.LapTime === oldData[index].LapTime
      );
    };

    const processedData = processData(data);
    const processedData2 = processData(data2);

    // Check for changes in `data` and `data2`
    const isDataChanged = !isSameData(data, prevDataRef.current);
    const isData2Changed = !isSameData(data2, prevData2Ref.current);

    // If no changes in either dataset, skip redraw
    if (!isDataChanged && !isData2Changed) return;

    // Update previous data references
    if (isDataChanged) prevDataRef.current = data;
    if (isData2Changed) prevData2Ref.current = data2;

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

    const xAxis = d3.axisBottom(xScale).ticks(globalExtents.lapNumberExtent);
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    const yAxisGroup = chart.append("g").attr("class", "y-axis").call(yAxis);

    if (processedData.length > 0) {
      if (isDataChanged) {
        svg.selectAll(".driver-name-label").remove();
        svg.selectAll(".scatterplot-circle").remove();
        svg.selectAll(".line").remove(); // Remove old line
        drawLaptimes(processedData, chart, xScale, yScale, "#ff9800", "#fff");
      }
    }

    if (processedData2.length > 0) {
      if (isData2Changed) {
        svg.selectAll(".scatterplot-circle2").remove();
        svg.selectAll(".line2").remove(); // Remove old line
        drawLaptimes2(processedData2, chart, xScale, yScale, "#00ff55", "#fff");
      }
    }
    // Zoom button functionality
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
        // Calculate the new yScale domain
        const maxLapTime = Math.max(
          ...[...processedData, ...processedData2].map((d) => d.LapTime)
        );
        yScale.domain([globalExtents.lapTimeExtent[0], maxLapTime - 10]);

        // If needed, adjust the xScale to match the zoomed range (optional)
        xScale.domain(globalExtents.lapNumberExtent); // Ensure the xScale domain remains consistent

        // Redraw the y-axis
        yAxisGroup
          .transition()
          .call(d3.axisLeft(yScale).tickFormat(formatTime));

        //Clear existing data points and lines
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
          drawLaptimes2(
            processedData2,
            chart,
            xScale,
            yScale,
            "#00ff55",
            "#fff"
          );
        }
      })
      .append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 16)
      .text("+");
  }, [data, data2, globalExtents]);

  return <svg ref={svgRef}></svg>;
};

export default LaptimesPlot;
