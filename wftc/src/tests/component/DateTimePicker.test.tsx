import { render, screen } from "@testing-library/react";
import DateTimePicker from "../../component/DateTimePicker";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("DateTimePicker", () => {
  it("renders DateTimePicker component", () => {
    render(
      <DateTimePicker
        name="date"
        value="2022-01-01"
        onChange={() => {}}
        onSelect={() => {}}
      />
    );

    const labelElement = screen.getByText("date");
    const inputElement = screen.getByLabelText("date");

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("handles user input", () => {
    const onChangeMock = vi.fn();
    const onSelectMock = vi.fn();

    render(
      <DateTimePicker
        name="date"
        value="2022-01-01"
        onChange={onChangeMock}
        onSelect={onSelectMock}
      />
    );
    const inputElement = screen.getByLabelText("date");
    const labelElement = screen.getByText("date");

    userEvent.type(inputElement, "2022-01-02");

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });
});
