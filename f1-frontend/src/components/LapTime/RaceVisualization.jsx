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
  const [selectedLap, setSelectedLap] = useState(null); // Selected lap

  useEffect(() => {
    const loadRaceData = async () => {
      setLoading(true);
      try {
        const { raceData, uniqueDrivers, globalExtents } = await fetchRaceData(
          raceId
        );
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

  const getLapDataForDriver = (driverNumber) => {
    if (!selectedLap || !driverNumber) return null;
    return raceData.find(
      (lap) =>
        lap.LapNumber === selectedLap.LapNumber &&
        lap.DriverNumber === driverNumber
    );
  };

  const lapData1 = getLapDataForDriver(selectedDriver1);
  const lapData2 = getLapDataForDriver(selectedDriver2);

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
              selectedLap={selectedLap} // Pass the selected lap
              setSelectedLap={setSelectedLap}
            />
          </div>

          {/* Additional Information Tiles */}
          <div className="lap-info-container">
            {/* Tile for Driver 1 */}
            <div className="lap-info-tile">
              <h3>Driver 1 Details</h3>
              {lapData1 ? (
                <div>
                  <p>
                    <strong>Lap Number:</strong> {lapData1.LapNumber}
                  </p>
                  <p>
                    <strong>Lap Time:</strong> {lapData1.LapTime}s
                  </p>
                  <p>
                    <strong>Driver:</strong> {lapData1.Driver}
                  </p>
                  <p>
                    <strong>Team:</strong> {lapData1.Team}
                  </p>
                </div>
              ) : (
                <p>No lap selected for Driver 1.</p>
              )}
            </div>

            {/* Tile for Driver 2 */}
            <div className="lap-info-tile">
              <h3>Driver 2 Details</h3>
              {lapData2 ? (
                <div>
                  <p>
                    <strong>Lap Number:</strong> {lapData2.LapNumber}
                  </p>
                  <p>
                    <strong>Lap Time:</strong> {lapData2.LapTime}s
                  </p>
                  <p>
                    <strong>Driver:</strong> {lapData2.Driver}
                  </p>
                  <p>
                    <strong>Team:</strong> {lapData2.Team}
                  </p>
                </div>
              ) : (
                <p>No lap selected for Driver 2.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RaceVisualization;
