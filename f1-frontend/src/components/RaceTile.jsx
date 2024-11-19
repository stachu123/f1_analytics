import React from "react";
import { Link } from "react-router-dom";

const RaceTile = ({ race }) => {
  return (
    <Link to={`/visualization/${race.id}`}>
      <div className="race-tile">
        <h3 className="race-name">{race.name}</h3>
        <p className="race-date">{race.date}</p>
        <p className="race-location">{race.location}</p>
      </div>
    </Link>
  );
};

export default RaceTile;
