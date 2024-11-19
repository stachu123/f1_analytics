import React, { useState, useEffect } from "react";
import axios from "axios";
import RaceTile from "./RaceTile";

const RaceList = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    axios
      .get(`api/races/2024`)
      .then((response) => setRaces(response.data))
      .catch((error) => console.error("Error fetching races:", error));
  }, []);

  return (
    <div className="race-list">
      {races.map((race) => (
        <RaceTile key={race.id} race={race} />
      ))}
    </div>
  );
};

export default RaceList;
