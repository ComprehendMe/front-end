import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ContinueSection } from "@/components/dashboard/continue-section";
import { PatientsCarousel } from "@/components/dashboard/patients-carousel";
import { StatsAvatar } from "@/components/dashboard/stats-avatar";
import { WeeklyMinutesChart } from "@/components/dashboard/weekly-minutes-chart";
import { FriendsPanel } from "@/components/dashboard/friends-panel";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { getPatientAvatar } from "@/lib/patient-avatar";
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
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const firstName = getFirstName(user);
  const greeting = getTimeGreeting();

  const activeChats = allChats.filter((c) => !c.endedAt);

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
      })
      .finally(() => setLoadingPatients(false));
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
    <main className="mt-8 grid grid-cols-[1fr_340px] gap-5">
      <div className="flex w-full flex-col gap-7">
        <div className="w-full rounded-3xl bg-linear-to-bl from-[#0978AA] to-[#1497D2] px-8 py-10 text-white">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Access Premium Patients</h2>
            <p className="text-lg font-normal">
              Advanced clinical cases for specialized training.
            </p>
            <Button
              className="rounded-full bg-white/90 text-lg font-medium text-primary hover:bg-white"
              size="lg"
            >
              Go premium!
            </Button>
          </div>
        </div>{" "}
        {patients.length >= 3 && (
          <div
            className="relative overflow-hidden"
            style={{ maxWidth: "720px" }}
          >
            <div
              className="flex gap-3 animate-scroll-left"
              style={{
                width: "fit-content",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "paused";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "running";
              }}
            >
              {/* First set of 3 patients */}
              {patients.slice(0, 3).map((patient) => (
                <button
                  key={`${patient.id}-1`}
                  type="button"
                  disabled={startingId !== null}
                  onClick={() => handlePatientClick(patient)}
                  className="flex-shrink-0 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 text-left shadow-xs transition hover:shadow-sm hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    width: "240px",
                    minWidth: "240px",
                  }}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={getPatientAvatar(patient.name)}
                      alt={patient.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground leading-tight">
                      {patient.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground leading-tight">
                      {patient.problem}
                    </p>
                  </div>
                </button>
              ))}

              {/* Duplicate set of 3 patients for seamless loop */}
              {patients.slice(0, 3).map((patient) => (
                <button
                  key={`${patient.id}-2`}
                  type="button"
                  disabled={startingId !== null}
                  onClick={() => handlePatientClick(patient)}
                  className="flex-shrink-0 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 text-left shadow-xs transition hover:shadow-sm hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    width: "240px",
                    minWidth: "240px",
                  }}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={getPatientAvatar(patient.name)}
                      alt={patient.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground leading-tight">
                      {patient.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground leading-tight">
                      {patient.problem}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {activeChats.length > 0 ? (
          <div className="py-2">
            <ContinueSection
              chats={activeChats}
              patients={patients}
              title="Continue conversation"
            />
          </div>
        ) : (
          <div id="patients">
            <PatientsCarousel
              patients={patients}
              loading={loadingPatients}
              startingId={startingId}
              onSelectPatient={handlePatientClick}
            />
          </div>
        )}
      </div>{" "}
      <div className="w-full">
        <div className="min-h-screen rounded-3xl border bg-white px-3.5 py-6">
          <h2 className="text-[16px] font-semibold text-black mb-6">
            Statistic
          </h2>
          <div className="flex flex-col gap-6 text-center">
            <div className="relative pt-0">
              <StatsAvatar
                user={user}
                streak={stats?.streak ?? 0}
                ringProgress={stats?.ringProgress ?? 0}
              />{" "}
              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {greeting} {firstName}
                </h3>
                <p className="text-sm font-medium text-gray-500">
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
