import DashboardHeader from "./components/DashboardHeader";
import QuickActions from "./components/QuickActions";
import StatsGrid from "./components/StartGrid";

export default function AppHome() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsGrid />

      <QuickActions />
    </div>
  );
}
