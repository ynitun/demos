import React from "react";

interface WeatherTextareaProps {
  weather: Weather[];
}

interface Weather {
  weather?: [];
}

const WeatherTextarea: React.FC<WeatherTextareaProps> = ({ weather }) => {
  return (
    <div className="weather">
      <textarea
        name="weather"
        readOnly
        placeholder="Weather"
        value={weather.map((weth: any) =>
          weth.map((weth: { forecast: string }) => weth.forecast)
        )}
      />
    </div>
  );
};

export default WeatherTextarea;
