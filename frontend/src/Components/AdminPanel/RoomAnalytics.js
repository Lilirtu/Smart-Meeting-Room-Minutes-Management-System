import React, { useEffect, useState } from "react";

const RoomAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Dummy data — replace with API fetch later
    setStats({
      totalRooms: 10,
      bookedRooms: 4,
      availableRooms: 6,
    });
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="room-analytics">
      <h3>Room Usage Analytics</h3>
      <p>Total Rooms: {stats.totalRooms}</p>
      <p>Booked Rooms: {stats.bookedRooms}</p>
      <p>Available Rooms: {stats.availableRooms}</p>
    </div>
  );
};


export default RoomAnalytics;
