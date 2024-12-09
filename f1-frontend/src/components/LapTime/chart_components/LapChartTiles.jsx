import React, { useEffect, useState } from "react";
import "../../../styles/ChartTiles.css";

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
      country: "/images/flags/nl.png",
      team: "/images/teams/red bull.avif",
    },
    PER: {
      fullName: "Sergio Perez",
      imageUrl: "/images/drivers/PER.avif",
      country: "/images/flags/mx.png",
      team: "/images/teams/red bull.avif",
    },
    HAM: {
      fullName: "Lewis Hamilton",
      imageUrl: "/images/drivers/HAM.avif",
      country: "/images/flags/gb.png",
      team: "/images/teams/mercedes.avif",
    },
    RIC: {
      fullName: "Daniel Ricciardo",
      imageUrl: "/images/drivers/RIC.avif",
      country: "/images/flags/au.png",
      team: "/images/teams/rb.avif",
    },
    BOT: {
      fullName: "Valtteri Bottas",
      imageUrl: "/images/drivers/BOT.avif",
      country: "/images/flags/fi.png",
      team: "/images/teams/kick sauber.avif",
    },
    LEC: {
      fullName: "Charles Leclerc",
      imageUrl: "/images/drivers/LEC.avif",
      country: "/images/flags/mc.png",
      team: "/images/teams/ferrari.avif",
    },
    NOR: {
      fullName: "Lando Norris",
      imageUrl: "/images/drivers/NOR.avif",
      country: "/images/flags/uk.png",
      team: "images/teams/mclaren.avif",
    },
    PIA: {
      fullName: "Oscar Piastri",
      imageUrl: "/images/drivers/PIA.avif",
      country: "/images/flags/at.png",
      team: "/images/teams/mclaren.avif",
    },
    GAS: {
      fullName: "Pierre Gasly",
      imageUrl: "/images/drivers/GAS.avif",
      country: "/images/flags/fr.png",
      team: "/images/teams/alpine.avif",
    },
    MAG: {
      fullName: "Kevin Magnussen",
      imageUrl: "/images/drivers/MAG.avif",
      country: "/images/flags/dk.png",
      team: "/images/teams/haas.avif",
    },
    ZHO: {
      fullName: "Zhou Guanyu",
      imageUrl: "/images/drivers/ZHO.avif",
      country: "/images/flags/cn.png",
      team: "/images/teams/kick sauber.avif",
    },
    SAI: {
      fullName: "Carlos Sainz Jr.",
      imageUrl: "/images/drivers/SAI.avif",
      country: "/images/flags/es.png",
      team: "/images/teams/ferrari.avif",
    },
    HUL: {
      fullName: "Nico Hulkenberg",
      imageUrl: "/images/drivers/HUL.avif",
      country: "/images/flags/de.png",
      team: "/images/teams/haas.avif",
    },
    ALO: {
      fullName: "Fernando Alonso",
      imageUrl: "/images/drivers/ALO.avif",
      country: "/images/flags/es.png",
      team: "/images/teams/aston martin 2024.avif",
    },
    OCO: {
      fullName: "Esteban Ocon",
      imageUrl: "/images/drivers/OCO.avif",
      country: "/images/flags/fr.png",
      team: "/images/teams/alpine.avif",
    },
    COL: {
      fullName: "Franco Colapinto",
      imageUrl: "/images/drivers/COL.avif",
      country: "/images/flags/ar.png",
      team: "/images/teams/williams.avif",
    },
    STR: {
      fullName: "Lance Stroll",
      imageUrl: "/images/drivers/STR.avif",
      country: "/images/flags/ca.png",
      team: "/images/teams/aston martin 2024.avif",
    },
    TSU: {
      fullName: "Yuki Tsunoda",
      imageUrl: "/images/drivers/TSU.avif",
      country: "/images/flags/jp.png",
      team: "/images/teams/rb.avif",
    },
    ALB: {
      fullName: "Alex Albon",
      imageUrl: "/images/drivers/ALB.avif",
      country: "/images/flags/my.png",
      team: "/images/teams/williams.avif",
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

    const { fullName, imageUrl, country, team } = getDriverData(Driver);
    const tireImage = tireImageMap[Compound];

    return (
      <div className="tile" style={{ borderColor: "gray" }}>
        <div className="tile-content">
          {/* Left section with driver image */}
          <div className="driver-image-container">
            {imageUrl ? (
              <img src={imageUrl} alt={fullName} className="driver-image" />
            ) : (
              <p>No image available</p>
            )}
            <h3>
              {fullName}{" "}
              <img
                src={country}
                alt={`${fullName}'s country`}
                className="country-flag"
              />
            </h3>
          </div>

          {/* Right section with driver name and details */}
          <div className="driver-info">
            <p>
              <strong>Lap Time:</strong> {formatTime(LapTime)}
            </p>
            <p>
              <strong>Position:</strong> {+Position}
            </p>
            <p>
              <strong>Compound:</strong>
              {tireImage && (
                <img
                  src={tireImage}
                  alt={`${Compound} tire`}
                  className="tire-image"
                />
              )}
              {Compound}
            </p>
          </div>
        </div>
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
