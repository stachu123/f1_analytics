import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LaptimesPlot from "./laptimesplot.jsx";
import * as d3 from "d3";

const RaceVisualization = () => {
  const { raceId } = useParams();
  const [raceData, setRaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverNumbers, setDriverNumbers] = useState([]);
  const [selectedDriver1, setSelectedDriver1] = useState(null); // First driver
  const [selectedDriver2, setSelectedDriver2] = useState(null); // Second driver
  const [globalExtents, setGlobalExtents] = useState({
    lapNumberExtent: [0, 1],
    lapTimeExtent: [0, 1],
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/race/${raceId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        const raceData = data.data;
        setRaceData(raceData);
        console.log(raceData);
        setLoading(false);

        const driverDetails = raceData.map((entry) => ({
          driverNumber: entry.DriverNumber,
          driverName: entry.Driver,
        }));

        const uniqueDrivers = Array.from(
          new Map(
            driverDetails.map((item) => [item.driverNumber, item])
          ).values()
        );

        setDriverNumbers(uniqueDrivers);

        const parseLapTime = (lapTime) => {
          // Check if lapTime is a valid string
          if (typeof lapTime !== "string") {
            return null;
          }

          if (!lapTime.trim()) return null; // Ensure lapTime is not just empty spaces

          // Match the time in the format: "X days HH:MM:SS.SSSSSS"
          const timeMatch = lapTime.match(
            /(\d+) days? (\d+):(\d+):(\d+)\.(\d+)/
          );
          if (!timeMatch) return null; // If the regex doesn't match, return null

          // Destructure the match result into components (days, hours, minutes, seconds, and milliseconds)
          const [, days, hours, minutes, seconds, milliseconds] = timeMatch.map(
            (v, i) => (i === 0 ? v : Number(v))
          );

          // Convert everything to total seconds:
          const totalSeconds =
            days * 24 * 60 * 60 + // Convert days to seconds
            hours * 60 * 60 + // Convert hours to seconds
            minutes * 60 + // Convert minutes to seconds
            seconds + // Add seconds
            milliseconds / 1000000; // Convert milliseconds to seconds

          return totalSeconds;
        };

        const allLapNumbers = raceData.map((d) => +d.LapNumber);
        const allLapTimes = raceData
          .map((d) => parseLapTime(d.LapTime))
          .filter((t) => t !== null);

        setGlobalExtents({
          lapNumberExtent: [d3.min(allLapNumbers), d3.max(allLapNumbers)],
          lapTimeExtent: [d3.min(allLapTimes), d3.max(allLapTimes)],
        });
      })
      .catch((error) => {
        console.error("Error fetching race data:", error);
        setLoading(false);
      });
  }, [raceId]);

  const handleDriverClick = (driverNumber, isFirstDriver) => {
    if (isFirstDriver) {
      setSelectedDriver1(driverNumber);
    } else {
      setSelectedDriver2(driverNumber);
    }
  };

  const getFilteredData = (driverNumber) => {
    return driverNumber
      ? raceData.filter((d) => d.DriverNumber === driverNumber)
      : [];
  };

  const filteredData1 = getFilteredData(selectedDriver1);
  const filteredData2 = getFilteredData(selectedDriver2);

  return (
    <div className="race-visualization-container">
      {loading && <p>Loading race data...</p>}

      {!loading && (
        <>
          {/* Driver Buttons */}
          <div className="driver-buttons-container">
            {/* Left Buttons (First Driver) */}
            <div className="driver-buttons left-buttons">
              {driverNumbers.map((driver) => (
                <button
                  key={`left-${driver.driverNumber}`}
                  onClick={() => handleDriverClick(driver.driverNumber, true)} // Pass true for first driver
                  className={`driver-button ${
                    selectedDriver1 === driver.driverNumber ? "selected" : ""
                  }`}
                >
                  <img
                    src={`/images/numbers/${driver.driverNumber}.avif`}
                    alt={`Driver ${driver.driverNumber}`}
                    className="driver-number-img"
                  />
                  {driver.driverName}
                </button>
              ))}
            </div>

            {/* Right Buttons (Second Driver) */}
            <div className="driver-buttons right-buttons">
              {driverNumbers.map((driver) => (
                <button
                  key={`right-${driver.driverNumber}`}
                  onClick={() => handleDriverClick(driver.driverNumber, false)} // Pass false for second driver
                  className={`driver-button ${
                    selectedDriver2 === driver.driverNumber ? "selected" : ""
                  }`}
                >
                  <img
                    src={`/images/numbers/${driver.driverNumber}.avif`}
                    alt={`Driver ${driver.driverNumber}`}
                    className="driver-number-img"
                  />
                  {driver.driverName}
                </button>
              ))}
            </div>
          </div>

          {/* Lap Times Plot */}
          <div className="laptime-plot-container">
            <LaptimesPlot
              data1={filteredData1} // Pass data for the first driver
              data2={filteredData2} // Pass data for the second driver
              globalExtents={globalExtents}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RaceVisualization;
