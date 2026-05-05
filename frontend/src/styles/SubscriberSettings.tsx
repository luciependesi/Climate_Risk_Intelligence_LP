import { useState } from "react";

type Props = {
  initialHighRisk: number;
  initialAqi: number;
  initialRain: number;
  initialBattery: number;
  onChange?: (settings: {
    highRisk: number;
    aqi: number;
    rain: number;
    battery: number;
  }) => void;
};

export function SubscriberSettings({
  initialHighRisk,
  initialAqi,
  initialRain,
  initialBattery,
  onChange,
}: Props) {
  const [highRisk, setHighRisk] = useState(initialHighRisk);
  const [aqi, setAqi] = useState(initialAqi);
  const [rain, setRain] = useState(initialRain);
  const [battery, setBattery] = useState(initialBattery);

  const emit = (
    next: Partial<{
      highRisk: number;
      aqi: number;
      rain: number;
      battery: number;
    }>
  ) => {
    const merged = {
      highRisk,
      aqi,
      rain,
      battery,
      ...next,
    };
    onChange?.(merged);
  };

  return (
    <div className="card">
      <div className="card-title">Subscriber Settings</div>
      <div className="subscriber-settings">
        <div className="subscriber-settings-row">
          <label>High risk threshold</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={highRisk}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setHighRisk(v);
              emit({ highRisk: v });
            }}
          />
        </div>

        <div className="subscriber-settings-row">
          <label>AQI threshold</label>
          <input
            type="number"
            value={aqi}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setAqi(v);
              emit({ aqi: v });
            }}
          />
        </div>

        <div className="subscriber-settings-row">
          <label>Rain threshold (mm/hr)</label>
          <input
            type="number"
            value={rain}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setRain(v);
              emit({ rain: v });
            }}
          />
        </div>

        <div className="subscriber-settings-row">
          <label>Battery threshold (mV)</label>
          <input
            type="number"
            value={battery}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setBattery(v);
              emit({ battery: v });
            }}
          />
        </div>
      </div>
    </div>
  );
}