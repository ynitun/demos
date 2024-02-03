// LocationSelect.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LocationSelect from "../../component/LocationSelect";

describe("LocationSelect Component", () => {
  const mockAreaMetadata = [
    {
      name: "Area1",
      label_location: { latitude: 123, longitude: 456 },
    },
    {
      name: "Area2",
      label_location: { latitude: 789, longitude: 101 },
    },
  ];

  test("renders LocationSelect component", () => {
    render(
      <LocationSelect areaMetadata={mockAreaMetadata} onClick={() => {}} />
    );

    const selectElement = screen.getByRole("listbox");
    expect(selectElement).toBeInTheDocument();
  });
});
