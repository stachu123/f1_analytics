import * as d3 from "d3";

export const fetchRaceData = async (raceId) => {
  const parseLapTime = (lapTime) => {
    if (typeof lapTime !== "string" || !lapTime.trim()) return null;

    const timeMatch = lapTime.match(
      /(\d+) days? (\d+):(\d+):(\d+)\.(\d+)/
    );
    if (!timeMatch) return null;

    const [, days, hours, minutes, seconds, milliseconds] = timeMatch.map((v, i) =>
      i === 0 ? v : Number(v)
    );

    const totalSeconds =
      days * 24 * 60 * 60 +
      hours * 60 * 60 +
      minutes * 60 +
      seconds +
      milliseconds / 1000000;

    return totalSeconds;
  };

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/race/${raceId}/`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const jsonData = await response.json();
    const raceData = jsonData.data;

    const driverDetails = raceData.map((entry) => ({
      driverNumber: entry.DriverNumber,
      driverName: entry.Driver,
    }));

    const uniqueDrivers = Array.from(
      new Map(driverDetails.map((item) => [item.driverNumber, item])).values()
    );

    const allLapNumbers = raceData.map((d) => +d.LapNumber);
    const allLapTimes = raceData
      .map((d) => parseLapTime(d.LapTime))
      .filter((t) => t !== null);

    const globalExtents = {
      lapNumberExtent: [d3.min(allLapNumbers), d3.max(allLapNumbers)],
      lapTimeExtent: [d3.min(allLapTimes), d3.max(allLapTimes)],
    };

    return {
      raceData,
      uniqueDrivers,
      globalExtents,
    };
  } catch (error) {
    console.error("Error fetching race data:", error);
    throw error;
  }
};
