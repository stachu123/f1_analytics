import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import LaptimesPlot from "./laptimesplot";

const RaceVisualization = () => {
  const { raceId } = useParams(); // Get race ID from URL
  const [raceData, setRaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverNumbers, setDriverNumbers] = useState([]); // Store unique driver numbers
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Fetching the data:
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
        setRaceData(data.data); // Extract 'data' field from API response
        console.log(data.data);
        setLoading(false);
        const driverDetails = data.data.map((entry) => ({
          driverNumber: entry.DriverNumber,
          driverName: entry.Driver,
        }));

        const uniqueDrivers = Array.from(
          new Map(
            driverDetails.map((item) => [item.driverNumber, item])
          ).values()
        );

        setDriverNumbers(uniqueDrivers);
      })
      .catch((error) => {
        console.error("Error fetching race data:", error);
        setLoading(false);
      });
  }, [raceId]);

  const handleDriverClick = (driverNumber) => {
    setSelectedDriver(driverNumber);
  };

  const filteredData = raceData.filter(
    (entry) => entry.DriverNumber === selectedDriver
  );

  return (
    <div>
      {/* Render buttons for each driver */}
      <div className="driver-buttons">
        {driverNumbers.map((driver) => (
          <button
            key={driver.driverNumber}
            onClick={() => handleDriverClick(driver.driverNumber)}
            className={`driver-button ${
              selectedDriver === driver.driverNumber ? "selected" : ""
            }`}
          >
            <img
              src={`/images/numbers/${driver.driverNumber}.avif`} // Path to AVIF number image
              alt={`Driver ${driver.driverNumber}`}
              className="driver-number-img"
            />
            {driver.driverName}
          </button>
        ))}
      </div>
      <div className="plot-container">
        {selectedDriver ? (
          <LaptimesPlot data={filteredData} />
        ) : (
          <p>Please select a driver to view their lap times.</p>
        )}
      </div>
    </div>
  );
};

export default RaceVisualization;
