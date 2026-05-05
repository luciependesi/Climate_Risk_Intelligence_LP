//this page shows the details of a device, including its location on a map, its hourly AQI chart, and its daily environmental chart.
import { DeviceMap } from "../components/DeviceMap";
import { HourlyAQIChart } from "../components/HourlyAQIChart";
import { DailyEnvChart } from "../components/DailyEnvChart";
import { RiskGauge } from "../components/RiskGauge";
import { AnimatedContainer } from "../components/AnimatedContainer";

export function DeviceDetailPage({ deviceId }: { deviceId: string }) {
  return (
    <AnimatedContainer keyId={deviceId}>
      <div style={{ display: "grid", gap: 16 }}>
        <DeviceMap onSelect={() => {}} />

        <div style={{ display: "flex", gap: 16 }}>
          <RiskGauge deviceId={deviceId} />
        </div>

        <HourlyAQIChart deviceId={deviceId} />
        <DailyEnvChart deviceId={deviceId} />
      </div>
    </AnimatedContainer>
  );
}