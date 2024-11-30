import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LaptimesPlot from "./laptimesplot.jsx";
import { fetchRaceData } from "./chart_components/LoadLapTimeData";

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
    const loadRaceData = async () => {
      setLoading(true);
      try {
        const { raceData, uniqueDrivers, globalExtents } = await fetchRaceData(raceId);
        setRaceData(raceData);
        setDriverNumbers(uniqueDrivers);
        setGlobalExtents(globalExtents);
      } catch (error) {
        console.error("Failed to load race data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRaceData();
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
                  className={`driver-button-left ${
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
                  className={`driver-button-right ${
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
              data={filteredData1} // Pass data for the first driver
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
