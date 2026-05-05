import { useLiveSensorStream } from "@/hooks/useLiveSensorStream";
import { LiveReadingCard } from "@/components/widgets/LiveReadingCard";

export default function DashboardPage() {
  const reading = useLiveSensorStream();

  return (
    <div>
      <h1>Dashboard</h1>
      <LiveReadingCard reading={reading} />
    </div>
  );
}