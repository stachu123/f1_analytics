import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { useParams } from "react-router-dom";

const RaceVisualization = () => {
  const { raceId } = useParams(); // Get race ID from URL
  const [raceData, setRaceData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching race data:", error);
        setLoading(false);
      });
  }, [raceId]);

  return <div id="visualization"></div>;
};

export default RaceVisualization;
