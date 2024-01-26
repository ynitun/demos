import { FC } from "react";
interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {
  return (
    <form>
      <div className="container">
        <div>
          <h3>{title}</h3>
        </div>
        <div>
          <div className="datetime">
            <label>Date</label>
            <input name="date" type="date" />
          </div>
          <div className="datetime">
            <label>Time</label>
            <input name="time" type="time" />
          </div>
        </div>
        <div>
          <div className="locations">
            <select name="locations" size={6}>
              <option value="1"> Location 1 </option>
              <option value="2"> Location 2 </option>
              <option value="3"> Location 3 </option>
              <option value="4"> Location 4 </option>
              <option value="5"> Location 5 </option>
              <option value="6"> Location 6 </option>
            </select>
          </div>
          <div className="weather">
            <textarea name="weather" readOnly placeholder="Weather" />
          </div>
        </div>
        <div>
          <div className="image">
            <img src="" alt="Screenshot" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default App;
