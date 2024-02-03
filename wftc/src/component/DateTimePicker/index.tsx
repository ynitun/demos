// DateTimePicker.jsx
import React from "react";

interface DateTimePickerProps {
  name: string;
  value: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onSelect: (e: React.FormEvent<HTMLInputElement>) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  name,
  value,
  onChange,
  onSelect,
}) => {
  const inputId = `${name}-input`;

  return (
    <div className="datetime">
      <label htmlFor={inputId}>{name}</label>
      <input
        id={inputId}
        name={name}
        type={name === "date" ? "date" : "time"}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
      />
    </div>
  );
};

export default DateTimePicker;
