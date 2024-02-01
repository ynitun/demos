/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { FC, useState, useEffect } from "react";

// Interface for the data returned by the server.
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
  [Symbol.iterator](): Iterator<number>;
}

const App: FC<AppProps> = ({ title }) => {
  // userState holds the user's input and any error messages related to it.
  const [allcameras, setAllImages] = useState<Cameras[]>([]);

  const [cameras, setTrafficImages] = useState<Cameras[]>([]);

  const [area_metadata, setAreaMetadata] = useState<AreaMetadata[]>([]);

  const [forecast, setForecast] = useState<Forecast[]>([]);

  const [weather, setWeather] = useState<Weather[]>([]);

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>();

  const [textValue1, setTextValue1] = useState<string>("");
  const [textValue2, setTextValue2] = useState<string>("");

  useEffect(() => {
    const cachedValue1 = localStorage.getItem("textboxValue1");
    if (cachedValue1) {
      setTextValue1(cachedValue1);
    }

    const cachedValue2 = localStorage.getItem("textboxValue2");
    if (cachedValue2) {
      setTextValue2(cachedValue2);
    }
  }, []);

  // DateTime input handlers for DatePicker component
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));

    // Cache the value to localStorage on every change
    if (e.currentTarget.name == "date") {
      const newValue1 = e.currentTarget.value;
      setTextValue1(newValue1);
      localStorage.setItem("textboxValue1", newValue1);
    }
    if (e.currentTarget.name == "time") {
      const newValue2 = e.currentTarget.value;
      setTextValue2(newValue2);
      localStorage.setItem("textboxValue2", newValue2);
    }
  };

  const handleInputSelect = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = {
      date: inputValues?.date,
      time: inputValues?.time,
    };

    // DateTime format
    const date_time = data.date + "T" + data.time + ":00";

    // Set DateTime to local storage
    localStorage.setItem("date_time", date_time);

    // Call APIs with Axios
    if (data.date != null && data.time != null) {
      try {
        const { data } = await axios.get(
          "https://api.data.gov.sg/v1/transport/traffic-images/?date_time=" +
            date_time
        );
        const images = data.items.map(({ cameras }: any) =>
          cameras.map(function (filteredCamera: { image: string | undefined }) {
            return <img src={filteredCamera.image} />;
          })
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

  // Find nearest points
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
    for (const point of points) {
      const distance = haversineDistance(inputPoint, point);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestPoint = point;
      }
    }
    return nearestPoint!;
  }

  // Insert DateTime and Location to Table
  const insertData = async (datetime: string, location: string) => {
    const dt = new Date(datetime);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

    const data = {
      datetime: dt.toISOString(),
      location: location,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create",
        data
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Location list click handler
  const handleClick = (event: { target: { value: string } }) => {
    try {
      const location = event.target.value;
      const ll = location.split("-");
      const po = allcameras.map(({ cameras }: any) =>
        cameras.map(function (filteredCamera: {
          location: string | undefined;
        }) {
          return filteredCamera.location;
        })
      );

      setPoints(po[0]);
      const lat: number = +ll[1];
      const lon: number = +ll[2];
      const inputPoint: Point = {
        latitude: lat,
        longitude: lon,
        [Symbol.iterator]: function (): Iterator<number, any, undefined> {
          throw new Error("Function not implemented.");
        },
      };
      const nearestPoint = findNearestPoint(points, inputPoint);

      const fiWeather = forecast.map(({ forecasts }: any) =>
        forecasts.filter(function (fc: { area: string | undefined }) {
          return fc.area?.includes(ll[0]);
        })
      );
      setWeather(fiWeather);

      const fiCamera = allcameras.map(({ cameras }: any) =>
        cameras
          .filter(
            (camera: { location: { latitude: number; longitude: number } }) =>
              camera.location.latitude == nearestPoint.latitude &&
              camera.location.longitude == nearestPoint.longitude
          )
          .map(function (filteredCamera: { image: string | undefined }) {
            return <img src={filteredCamera.image} />;
          })
      );
      setTrafficImages(fiCamera);

      // insert Data to SearchHistory table
      const dt: string = localStorage.getItem("date_time")!;
      insertData(dt?.toString(), ll[0]);
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
              name="date"
              type="date"
              value={textValue1}
              onChange={handleInputChange}
              onSelect={handleInputSelect}
            />
          </div>
          <div className="datetime">
            <label>Time</label>
            <input
              name="time"
              type="time"
              value={textValue2}
              onChange={handleInputChange}
              onSelect={handleInputSelect}
            />
          </div>
        </div>
        <div>
          <div className="locations">
            <select name="locations" size={8} onChange={handleClick}>
              return (
              {area_metadata.map((area_metadata: any) => (
                <option
                  value={
                    area_metadata.name +
                    "-" +
                    area_metadata.label_location.latitude +
                    "-" +
                    area_metadata.label_location.longitude
                  }
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
              value={weather.map((weth: any) =>
                weth.map((weth: { forecast: string }) => weth.forecast)
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
