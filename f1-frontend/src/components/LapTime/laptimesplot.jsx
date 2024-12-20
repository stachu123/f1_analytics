import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { drawLaptimes, drawLaptimes2 } from "./chart_components/DrawLapTimes";
import { LineLegend2, LineLegend1 } from "./chart_components/LineLegend";
import { ZoomButton } from "./chart_components/ZoomButton";
import { ChartTiles } from "./chart_components/LapChartTiles"; // Import the ChartTiles component
import "../../index.css";

const LaptimesPlot = ({ data = [], data2 = [], globalExtents }) => {
  const svgRef = useRef();
  const prevDataRef = useRef([]); // Store previous `data`
  const prevData2Ref = useRef([]);
  const iszoomedRef = useRef(false);
  const [selectedLap, setSelectedLap] = useState({ LapNumber: null }); // Store selected lap
  const [driverData1, setDriverData1] = useState({ LapNumber: null });
  const [driverData2, setDriverData2] = useState({ LapNumber: null });

  //HELPER FUNCTIONS

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

  /**
   * Process raw data array into a new array of objects with LapNumber as number, LapTime as seconds, and other columns as strings.
   * Also filter out rows with invalid LapTime.
   * @param {array} rawData - The raw data array
   * @returns {array} The processed data array
   */
  const processData = (rawData) => {
    return rawData
      .map((d) => ({
        LapNumber: +d.LapNumber,
        LapTime: parseLapTime(d.LapTime),
        Driver: d.Driver,
        Team: d.Team,
        Position: d.Position,
        DriverNumber: d.DriverNumber,
        Compound: d.Compound,
      }))
      .filter((d) => d.LapTime !== null);
  };

  /**
   * Compares two datasets to check if they contain the same lap data.
   *
   * @param {Array} newData - The new dataset containing lap information.
   * @param {Array} oldData - The old dataset to compare against.
   * @returns {boolean} - Returns true if both datasets have the same lap numbers and times, otherwise false.
   */
  const isSameData = (newData, oldData) => {
    if (newData.length !== oldData.length) return false;
    return newData.every(
      (item, index) =>
        item.LapNumber === oldData[index].LapNumber &&
        item.LapTime === oldData[index].LapTime
    );
  };

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

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("lap-rect").remove();
    // Set up the chart
    const width = svg.node().parentNode?.getBoundingClientRect().width || 800;
    const height = width * 0.4; // Maintain aspect ratio
    const margin = { top: 30, right: 30, bottom: 40, left: 60 };
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

    // Process data
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

    if (iszoomedRef.current) {
      svg.selectAll(".line").remove();
      svg.selectAll(".line2").remove();
      svg.selectAll(".y-axis").remove();
      iszoomedRef.current = false;
    }
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

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(globalExtents.lapNumberExtent);
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    // Draw axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    const yAxisGroup = chart.append("g").attr("class", "y-axis").call(yAxis);

    if (processedData.length > 0) {
      if (isDataChanged) {
        // Remove old legend, line, rectangles and circle
        svg.selectAll(".legend-text").remove();
        svg.selectAll(".scatterplot-circle").remove();
        svg.selectAll(".line").remove();
        svg.selectAll("lap-rect").remove();

        // Draw new legend, line, and circle
        drawLaptimes(processedData, chart, xScale, yScale, "#ff9800", "#fff");
        LineLegend1(processedData, svg, width, "#ff9800");
      }
    }

    if (processedData2.length > 0) {
      if (isData2Changed) {
        // Remove old legend, line, rectangles and circle
        svg.selectAll(".legend-text2").remove();
        svg.selectAll(".scatterplot-circle2").remove();
        svg.selectAll(".line2").remove();
        svg.selectAll("lap-rect").remove();

        // Draw new legend, line, and circle
        drawLaptimes2(processedData2, chart, xScale, yScale, "#00ff55", "#fff");
        LineLegend2(processedData2, svg, width, "#00ff55");
      }
    }

    // Zoom button functionality
    console.log(data);
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
      .text("zoom");

    // Draw rectangles to select lap
    svg.selectAll(".lap-rect").remove();
    chart
      .selectAll(".lap-rect")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", "lap-rect")
      .attr("x", (d) => xScale(d.LapNumber - 0.5)) // Center rectangles around the lap number
      .attr("y", 0)
      .attr("width", xScale(1) - xScale(0)) // Width spans 1 lap
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .attr("stroke", "lightgray")
      .attr("stroke-width", 0.05)
      .attr("cursor", "pointer")
      .on("click", function (event, d) {
        const clickedLap = d3.select(this).datum();

        // Log the clicked lap directly

        // Update the state
        setSelectedLap(clickedLap);

        // Update driver data using the clicked lap directly
        const driver1Lap = processedData.find(
          (d) => +d.LapNumber === clickedLap.LapNumber
        );
        const driver2Lap = processedData2.find(
          (d) => +d.LapNumber === clickedLap.LapNumber
        );

        setDriverData1(driver1Lap || { LapNumber: null });
        setDriverData2(driver2Lap || { LapNumber: null });

        // Update styles for all rectangles
        chart
          .selectAll(".lap-rect")
          .attr("stroke", (d) =>
            d.LapNumber === clickedLap.LapNumber ? "blue" : "lightgray"
          )
          .attr("stroke-width", (d) =>
            d.LapNumber === clickedLap.LapNumber ? 2 : 0.05
          );
      });
  }, [data, data2, globalExtents, setSelectedLap, selectedLap]);

  return (
    <div className="laptime-plot-container">
      <svg ref={svgRef}></svg>
      <ChartTiles
        selectedLap={selectedLap}
        driverData1={driverData1}
        driverData2={driverData2}
      />
    </div>
  );
};

export default LaptimesPlot;
