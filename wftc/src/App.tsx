import axios from "axios";
import { FC, useState } from "react";
import { useRef } from "react";

interface AppProps {
  title: string;
}

interface Cameras {
  cameras?: [];
}

interface AreaMetadata {
  name: string | number | readonly string[] | undefined;
  area_metadata?: [];
}

interface Forecast {
  forecasts?: [];
}

interface Weather {
  weather?: [];
}

interface Point {
  latitude: number;
  longitude: number;
}

const App: FC<AppProps> = ({ title }) => {
  const inputRef = useRef(null);

  const [allcameras, setAllImages] = useState<Cameras[]>([]);

  const [cameras, setTrafficImages] = useState<Cameras[]>([]);

  const [area_metadata, setAreaMetadata] = useState<AreaMetadata[]>([]);

  const [forecast, setForecast] = useState<Forecast[]>([]);

  const [weather, setWeather] = useState<Weather[]>([]);

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>();

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleInputSelect = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = {
      date: inputValues?.date,
      time: inputValues?.time,
    };

    const date_time = data.date + "T" + data.time + ":00";

    if (data.date != null && data.time != null) {
      try {
        const { data } = await axios.get(
          "https://api.data.gov.sg/v1/transport/traffic-images/?date_time=" +
            date_time
        );
        const images = data.items.map(({ cameras }) =>
          cameras.map((filteredCamera) => <img src={filteredCamera.image} />)
        );
        setTrafficImages(images);
        setAllImages(data.items);
      } catch (error) {
        console.log(error);
      }

      try {
        const { data } = await axios.get(
          "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast/?date_time=" +
            date_time
        );
        setAreaMetadata(data.area_metadata);
        setForecast(data.items);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [points, setPoints] = useState<Point[]>([]);

  function haversineDistance(point1: Point, point2: Point): number {
    const earthRadiusKm = 6371;
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) *
        Math.cos(point2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  function findNearestPoint(points: Point[], inputPoint: Point): Point {
    let nearestPoint: Point | null = null;
    let smallestDistance = Infinity;
    for (const point of points[0]) {
      const distance = haversineDistance(inputPoint, point);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestPoint = point;
      }
    }

    return nearestPoint!;
  }

  const handleClick = (event: { target: { value: string; id: string } }) => {
    try {
      const location = event.target.value;
      const id = event.target.id;
      const ll = id.split("-");

      const po = allcameras.map(({ cameras }) =>
        cameras.map((filteredCamera) => filteredCamera.location)
      );
      setPoints(po);
      const inputPoint: Point = { latitude: ll[0], longitude: ll[1] };
      const nearestPoint = findNearestPoint(points, inputPoint);

      const fiWeather = forecast.map(({ forecasts }) =>
        forecasts?.filter((fc) => fc.area.includes(location))
      );
      setWeather(fiWeather);
      const fiCamera = allcameras.map(({ cameras }) =>
        cameras
          ?.filter(
            (camera) =>
              camera.location.latitude == nearestPoint.latitude &&
              camera.location.longitude == nearestPoint.longitude
          )
          .map((filteredCamera) => <img src={filteredCamera.image} />)
      );
      setTrafficImages(fiCamera);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form>
      <div className="container">
        <div>
          <h3>{title}</h3>
        </div>
        <div>
          <div className="datetime">
            <label>Date</label>
            <input
              ref={inputRef}
              name="date"
              type="date"
              onChange={handleInputChange}
              onSelect={handleInputSelect}
            />
          </div>
          <div className="datetime">
            <label>Time</label>
            <input
              name="time"
              type="time"
              onChange={handleInputChange}
              onSelect={handleInputSelect}
            />
          </div>
        </div>
        <div>
          <div className="locations">
            <select name="locations" size={8}>
              return (
              {area_metadata.map((area_metadata) => (
                <option
                  key={area_metadata.name}
                  id={
                    area_metadata.label_location.latitude +
                    "-" +
                    area_metadata.label_location.longitude
                  }
                  value={area_metadata.name}
                  onClick={handleClick}
                >
                  {" "}
                  {area_metadata.name}
                </option>
              ))}
              );
            </select>
          </div>
          <div className="weather">
            <textarea
              name="weather"
              readOnly
              placeholder="Weather"
              value={weather.map((weather) =>
                weather.map((weth) => weth.forecast)
              )}
            />
          </div>
        </div>
        <div>
          <div className="image">
            <div>{cameras}</div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default App;
