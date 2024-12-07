import React, { useEffect, useState } from "react";

export const ChartTiles = ({ selectedLap, driverData1, driverData2 }) => {
  const [driver1Image, setDriver1Image] = useState(null);
  const [driver2Image, setDriver2Image] = useState(null);

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

  // Mapping of short driver names to full names and image paths
  const driverDataMap = {
    VER: {
      fullName: "Max Verstappen",
      imageUrl: "/images/drivers/VER.avif",
      country: "Netherlands",
    },
    HAM: {
      fullName: "Lewis Hamilton",
      imageUrl: "/images/drivers/HAM.avif",
      country: "United Kingdom",
    },
    RIC: {
      fullName: "Daniel Ricciardo",
      imageUrl: "/images/drivers/RIC.avif",
      country: "Australia",
    },
    BOT: {
      fullName: "Valtteri Bottas",
      imageUrl: "/images/drivers/BOT.avif",
      country: "Finland",
    },
    LEC: {
      fullName: "Charles Leclerc",
      imageUrl: "/images/drivers/LEC.avif",
      country: "Monaco",
    },
    NOR: {
      fullName: "Lando Norris",
      imageUrl: "/images/drivers/NOR.avif",
      country: "United Kingdom",
    },
    PIA: {
      fullName: "Oscar Piastri",
      imageUrl: "/images/drivers/PIA.avif",
      country: "Austria",
    },
    GAS: {
      fullName: "Pierre Gasly",
      imageUrl: "/images/drivers/GAS.avif",
      country: "France",
    },
    MAG: {
      fullName: "Kevin Magnussen",
      imageUrl: "/images/drivers/MAG.avif",
      country: "Denmark",
    },
    ZHO: {
      fullName: "Zhou Guanyu",
      imageUrl: "/images/drivers/ZHO.avif",
      country: "China",
    },
    SAI: {
      fullName: "Carlos Sainz Jr.",
      imageUrl: "/images/drivers/SAI.avif",
      country: "Spain",
    },
    HUL: {
      fullName: "Nico Hulkenberg",
      imageUrl: "/images/drivers/HUL.avif",
      country: "Germany",
    },
    ALO: {
      fullName: "Fernando Alonso",
      imageUrl: "/images/drivers/ALO.avif",
      country: "Spain",
    },
    OCO: {
      fullName: "Esteban Ocon",
      imageUrl: "/images/drivers/OCO.avif",
      country: "France",
    },
    COL: {
      fullName: "Franco Colapinto",
      imageUrl: "/images/drivers/COL.avif",
      country: "Argentina",
    },
    STR: {
      fullName: "Lance Stroll",
      imageUrl: "/images/drivers/STR.avif",
      country: "Canada",
    },
    TSU: {
      fullName: "Yuki Tsunoda",
      imageUrl: "/images/drivers/TSU.avif",
      country: "Japan",
    },
    ALB: {
      fullName: "Alex Albon",
      imageUrl: "/images/drivers/ALB.avif",
      country: "Malaysia",
    },
  };

  const tireImageMap = {
    SOFT: "/images/tires/SOFT.webp",
    MEDIUM: "/images/tires/MEDIUM.webp",
    HARD: "/images/tires/HARD.webp",
    INTER: "/images/tires/INTER.webp",
    WET: "/images/tires/WET.webp",
  };

  const getDriverData = (shortName) => {
    return driverDataMap[shortName] || { fullName: shortName, imageUrl: null }; // If not found, return short name and no image
  };

  const renderTile = (driverData, driverLabel, driverImage) => {
    if (!selectedLap || !driverData) {
      return (
        <div className="tile">
          <h3>{driverLabel}</h3>
          <p>No lap selected</p>
        </div>
      );
    }

    const {
      LapNumber,
      LapTime,
      Driver,
      Team,
      DriverNumber,
      Compound,
      Position,
    } = driverData;
    const { fullName, imageUrl } = getDriverData(Driver);
    const tireImage = tireImageMap[Compound];
    return (
      <div className="tile">
        <h3>{driverLabel}</h3>
        {imageUrl ? (
          <img src={imageUrl} alt={fullName} />
        ) : (
          <p>No image available</p>
        )}
        <p>
          <strong>Position:</strong> {+Position}
        </p>
        <p>
          <strong>Lap Number:</strong> {LapNumber}
        </p>
        <p>
          <strong>Lap Time:</strong> {formatTime(LapTime)}
        </p>
        <p>
          <strong>Driver:</strong> {fullName}
        </p>
        <p>
          <strong>Team:</strong> {Team}
        </p>
        <p>
          <strong>Driver Number:</strong> {DriverNumber}
        </p>
        <p>
          <strong>Compound:</strong>
          {tireImage && (
            <img
              src={tireImage}
              alt={`${Compound} tire`}
              style={{
                width: "60px",
                height: "60px",
                marginLeft: "8px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
          )}
          {Compound}{" "}
        </p>
      </div>
    );
  };

  return (
    <div className="lap-chart-tiles">
      {/* Add a heading that displays the selected lap */}
      <h2 className="selected-lap-heading">
        {selectedLap ? `LAP: ${selectedLap.LapNumber}` : "No Lap Selected"}
      </h2>

      {/* Chart tiles container */}
      <div className="chart-tiles">
        {renderTile(
          driverData1,
          getDriverData(driverData1.Driver).fullName,
          driver1Image
        )}
        {renderTile(
          driverData2,
          getDriverData(driverData2.Driver).fullName,
          driver2Image
        )}
      </div>
    </div>
  );
};
