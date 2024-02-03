// LocationSelect.js
import React from "react";

interface LocationSelectProps {
  areaMetadata: AreaMetadata[];
  onClick: (event: { target: { value: string } }) => void;
}

interface AreaMetadata {
  name: string | number | readonly string[] | undefined;
  label_location?: { latitude: number; longitude: number };
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  areaMetadata,
  onClick,
}) => {
  return (
    <div className="locations">
      <select name="locations" size={8} onChange={onClick}>
        {areaMetadata.map((areaMetadata: any) => (
          <option
            key={areaMetadata.name}
            value={`${areaMetadata.name}-${areaMetadata.label_location?.latitude}-${areaMetadata.label_location?.longitude}`}
          >
            {areaMetadata.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelect;
