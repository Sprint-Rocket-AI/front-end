import { useId } from 'react';

interface DateTimePickerProps {
  dateLabel?: string;
  timeLabel?: string;
  dateValue?: string;
  timeValue: string;
  onDateChange: (value?: string) => void;
  onTimeChange: (value: string) => void;
  minDate?: string;
  requiredDate?: boolean;
  disabled?: boolean;
}

export const DateTimePicker = ({
  dateLabel = 'Fecha',
  timeLabel = 'Hora',
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  minDate,
  requiredDate = false,
  disabled = false,
}: DateTimePickerProps) => {
  const inputId = useId();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor={`${inputId}-date`}>{dateLabel}</label>
        <input
          id={`${inputId}-date`}
          type="date"
          className="field"
          value={dateValue ?? ''}
          min={minDate}
          required={requiredDate}
          disabled={disabled}
          onChange={(e) => onDateChange(e.target.value || undefined)}
        />
      </div>

      <div>
        <label className="label" htmlFor={`${inputId}-time`}>{timeLabel}</label>
        <input
          id={`${inputId}-time`}
          type="time"
          className="field"
          value={timeValue}
          disabled={disabled}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};
