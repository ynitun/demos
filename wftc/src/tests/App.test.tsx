// App.test.tsx
import App from "../App";
import { render, screen } from "../utils/test-utils";

describe("Test App Component is rendered", () => {
  it("renders App component", () => {
    render(<App title="Test App" />);
    expect(screen.getByText("Test App")).toBeInTheDocument();
  });
});
