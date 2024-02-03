import React from "react";

interface TrafficImagesProps {
  cameras: Cameras[];
}

interface Cameras {
  cameras?: [];
}

const TrafficImages: React.FC<TrafficImagesProps> = ({ cameras }) => {
  return (
    <div className="image">
      <div>{cameras}</div>
    </div>
  );
};

export default TrafficImages;
