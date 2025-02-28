"use client";

import { useCallback, useRef } from "react";

import { InputGroup, InputGroupRef } from "./time-input/input-group.component";

type TimeInputProps = {
  value: Date;
  onChange: (value: Date) => void;
};

const formatTime = (value: number) => {
  if (value < 10) {
    return `0${value}`;
  }
  return value.toString();
};

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const hours = formatTime(value.getHours());
  const minutes = formatTime(value.getMinutes());
  const hoursRef = useRef<InputGroupRef>(null);
  const minutesRef = useRef<InputGroupRef>(null);

  const setHours = useCallback(
    (hourDigit: number, index: number) => {
      const hours_ = hours.split("");
      hours_[index] = hourDigit.toString();
      const newDate = new Date(value);

      newDate.setHours(parseInt(hours_.join("")));
      onChange(newDate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, hours]
  );

  const setMinutes = useCallback(
    (minuteDigit: number, index: number) => {
      const minutes_ = minutes.split("");
      minutes_[index] = minuteDigit.toString();
      const newDate = new Date(value);

      newDate.setMinutes(parseInt(minutes_.join("")));
      onChange(newDate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, minutes]
  );

  return (
    <div className="flex items-center gap-2">
      <InputGroup
        max={24}
        min={0}
        value={hours}
        onChange={(value) => setHours(value, 0)}
        ref={hoursRef}
        onBlur={(index) => {
          if (index === 1) {
            minutesRef.current?.focusFirstInput();
          }
        }}
      />

      <span>:</span>

      <InputGroup
        max={60}
        min={0}
        value={minutes}
        onChange={(value) => setMinutes(value, 0)}
        ref={minutesRef}
        onBlur={(index) => {
          if (index === 0) {
            hoursRef.current?.focusSecondInput();
          }
        }}
      />
    </div>
  );
};
