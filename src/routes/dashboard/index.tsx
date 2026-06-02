import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ContinueSection } from "@/components/dashboard/continue-section";
import { RecentConversations, StartLearningSection } from "@/components/dashboard/dashboard-sections";
import { StatsAvatar } from "@/components/dashboard/stats-avatar";
import { WeeklyMinutesChart } from "@/components/dashboard/weekly-minutes-chart";
import { FriendsPanel } from "@/components/dashboard/friends-panel";
import { Button } from "@/components/ui/button";
import {
  ApiError,
  createChat,
  getDashboardStats,
  listChats,
  listPatients,
  type Chat,
  type DashboardStats,
  type Patient,
} from "@/lib/api";
import { getTimeGreeting } from "@/lib/format-message-time";
import { getFirstName } from "@/lib/user-display";
import { Route as DashboardRoute } from "../dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = DashboardRoute.useRouteContext();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);
  const firstName = getFirstName(user);
  const greeting = getTimeGreeting();

  const activeChats = allChats.filter((c) => !c.endedAt);
  const endedChats = allChats.filter((c) => c.endedAt);

  useEffect(() => {
    Promise.all([listPatients(), listChats(), getDashboardStats()])
      .then(([patientList, chatList, dashboardStats]) => {
        const sorted = [...patientList].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPatients(sorted);
        setAllChats(chatList);
        setStats(dashboardStats);
      })
      .catch((e) => {
        toast.error(
          e instanceof ApiError ? e.message : "Could not load dashboard data."
        );
      });
  }, []);

  async function handlePatientClick(patient: Patient) {
    setStartingId(patient.id);
    try {
      const existing = allChats.find(
        (c) => c.patientId === patient.id && !c.endedAt
      );
      if (existing) {
        await navigate({
          to: "/dashboard/chat/$chatId",
          params: { chatId: existing.id },
        });
      } else {
        const chat = await createChat(patient.id);
        await navigate({
          to: "/dashboard/chat/$chatId",
          params: { chatId: chat.id },
        });
      }
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Could not start the conversation."
      );
    } finally {
      setStartingId(null);
    }
  }

  return (
    <main className="mt-4 grid min-h-0 grid-cols-1 gap-fluid-md lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-fluid-lg">
      <div className="flex min-w-0 w-full flex-col gap-fluid-lg">
        <div className="w-full rounded-[22px] bg-linear-to-br from-[#0978AA] to-[#1497D2] px-fluid-container py-fluid-section text-white shadow-sm relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_18%_30%,rgba(255,255,255,0.3),transparent_18%),radial-gradient(circle_at_85%_26%,rgba(255,255,255,0.22),transparent_16%),radial-gradient(circle_at_65%_75%,rgba(255,255,255,0.16),transparent_14%)]" />
          <div className="space-y-3">
            <h2 className="text-fluid-3xl leading-[1.15] font-semibold">
              Access Premium Patients
            </h2>
            <p className="text-fluid-lg leading-[1.25] font-normal opacity-95">
              Advanced clinical cases for specialized training.
            </p>
            <Button
              className="mt-2 h-11 rounded-full bg-white px-7 text-fluid-sm font-semibold text-[#1497D2] hover:bg-white hover:text-[#1497D2] hover:shadow-md transition-shadow"
              size="lg"
            >
              Go premium!
            </Button>
          </div>
        </div>
        {patients.length > 0 && (
          <StartLearningSection
            patients={patients}
            startingId={startingId}
            onStart={handlePatientClick}
          />
        )}
        {activeChats.length > 0 && (
          <ContinueSection
            chats={activeChats}
            title="Continue conversation"
          />
        )}
        {endedChats.length > 0 && (
          <RecentConversations chats={endedChats} />
        )}
      </div>
      <div className="w-full">
        <div className="rounded-[22px] border border-[#E8EDF2] bg-[#FCFDFE] px-fluid-container py-fluid-section">
          <h2 className="mb-6 text-fluid-lg font-semibold text-black">
            Statistic
          </h2>
          <div className="flex flex-col gap-fluid-xl text-center">
            <div className="relative">
              <StatsAvatar
                user={user}
                streak={stats?.streak ?? 0}
                ringProgress={stats?.ringProgress ?? 0}
              />
              <div className="mt-4 space-y-1">
                <h3 className="text-fluid-xl leading-[1.05] font-semibold text-[#1C1F22]">
                  {greeting} {firstName}
                </h3>
                <p className="mx-auto max-w-[min(275px,80%)] text-fluid-sm leading-[1.15] font-medium text-[#4B4E58]">
                  Continue your learning to achieve your target!
                </p>
              </div>
            </div>
            {stats ? (
              <WeeklyMinutesChart data={stats.weeklyMinutes} />
            ) : (
              <div className="h-[180px] rounded-xl bg-[#F0F5FA]" />
            )}
            <FriendsPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
