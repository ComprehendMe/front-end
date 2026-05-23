import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ApiError,
  getChat,
  getChatReview,
  listMessages,
  type Message,
  type MoveAnalysis,
  type ReviewResult,
} from "@/lib/api";
import { getPatientAvatar } from "@/lib/patient-avatar";
import { formatMessageTime } from "@/lib/format-message-time";
import { getInitials } from "@/lib/user-display";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/review/$chatId")({
  component: ReviewPage,
});

function ReviewPage() {
  const { chatId } = Route.useParams();
  const { user } = DashboardRoute.useRouteContext();
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const totalMoves = review?.moves.length ?? 0;
  const currentAnalysis = review?.moves[currentMove - 1] ?? null;

  useEffect(() => {
    Promise.all([getChatReview(chatId), listMessages(chatId), getChat(chatId)])
      .then(([r, msgs]) => {
        setReview(r);
        setMessages(msgs);
      })
      .catch((e) => {
        toast.error(
          e instanceof ApiError ? e.message : "Failed to load review."
        );
      })
      .finally(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMove]);

  const patientMsgs = messages.filter((m) => m.role === "model");
  const visibleMessages = messages.slice(
    0,
    currentMove === 0
      ? 1
      : currentMove >= totalMoves
        ? messages.length
        : messages.findIndex(
            (m) =>
              m.role === "user" &&
              m.content === review?.moves[currentMove]?.content
          ) + 1
  );

  function handlePrev() {
    setCurrentMove((p) => Math.max(0, p - 1));
  }

  function handleNext() {
    setCurrentMove((p) => Math.min(totalMoves, p + 1));
  }

  async function handleDownload() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? "/api"}/chats/${chatId}/review/report`,
        { credentials: "include" }
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `review-${chatId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download report.");
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Analysing your conversation with AI...
          </p>
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Review not available.</p>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] gap-5 px-6 py-5">
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Chat Review
            </h1>
            <p className="text-sm text-muted-foreground">
              Replay your conversation step-by-step
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Move {currentMove}/{totalMoves}
            </span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${totalMoves > 0 ? (currentMove / totalMoves) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-xl border bg-white p-6">
          {visibleMessages.map((msg, i) => {
            const isUser = msg.role === "user";
            const isFirstPatientMsg = i === 0 && !isUser;
            const patient = review.patient;

            if (isUser) {
              return (
                <div key={i} className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        Me
                      </p>
                      {msg.createdAt ? (
                        <p className="text-xs text-muted-foreground">
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      ) : null}
                    </div>
                    <Avatar className="size-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="max-w-[70%] rounded-2xl bg-[#D6EBF7] px-4 py-3 text-sm text-foreground">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={getPatientAvatar(patient.name)}
                      alt={patient.name}
                    />
                    <AvatarFallback className="bg-[#F0F5FA] text-xs font-semibold text-primary">
                      {patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {isFirstPatientMsg ? patient.name : patient.name}
                    </p>
                    {msg.createdAt ? (
                      <p className="text-xs text-muted-foreground">
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="ml-10 max-w-[70%] rounded-2xl bg-[#F0F5FA] px-4 py-3 text-sm text-foreground">
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex w-[340px] flex-col rounded-xl border bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Performance Panel
          </h2>
          <p className="text-xs text-muted-foreground">AI feedback per move</p>
        </div>

        {currentMove === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <TriangleAlert className="h-10 w-10 text-yellow-500" />
            <p className="text-sm font-semibold text-foreground">
              Game not started!
            </p>
            <p className="text-xs text-muted-foreground">
              No moves on the chat.
            </p>
            <p className="text-xs text-muted-foreground">
              Press ▶ to reveal the first intervention.
            </p>
          </div>
        ) : currentAnalysis ? (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium " +
                  (currentAnalysis.quality === "strong"
                    ? "border-green-300 bg-green-100 text-green-700"
                    : currentAnalysis.quality === "adequate"
                      ? "border-blue-300 bg-blue-100 text-blue-700"
                      : currentAnalysis.quality === "needs_attention"
                        ? "border-yellow-300 bg-yellow-100 text-yellow-700"
                        : "border-red-300 bg-red-100 text-red-700")
                }
              >
                {currentAnalysis.quality === "strong"
                  ? "Strong Intervention"
                  : currentAnalysis.quality === "adequate"
                    ? "Adequate"
                    : currentAnalysis.quality === "needs_attention"
                      ? "Needs Attention"
                      : "Needs Adjustment"}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {currentAnalysis.category}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-foreground">
              {currentAnalysis.feedback
                .split(/(\*\*.*?\*\*)/)
                .map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  )
                )}
            </div>

            {currentAnalysis.highlights.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-green-700">
                  Highlights
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                  {currentAnalysis.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentAnalysis.improvements.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-amber-700">
                  Improvements
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                  {currentAnalysis.improvements.map((im, i) => (
                    <li key={i}>{im}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col items-center gap-3 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentMove <= 0}
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentMove >= totalMoves}
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {currentAnalysis && (
            <p className="text-sm font-medium">
              Move score:{" "}
              <span className="font-bold">{currentAnalysis.score}/10</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Total score:{" "}
            <span className="font-bold text-foreground">
              {review.totalScore}/100
            </span>
          </p>
          {currentMove >= totalMoves && totalMoves > 0 && (
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setSummaryOpen(true)}
            >
              View full summary
            </Button>
          )}
        </div>
      </div>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Conversation Summary</DialogTitle>
            <DialogDescription>
              All moves and points breakdown.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-around rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{review.totalScore}/100</p>
              <p className="text-xs text-muted-foreground">Total score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {review.moves.length > 0
                  ? (review.totalScore / 10).toFixed(1)
                  : "0"}
                /10
              </p>
              <p className="text-xs text-muted-foreground">Average Move</p>
            </div>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${
                review.totalScore >= 70
                  ? "bg-green-500"
                  : review.totalScore >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${review.totalScore}%` }}
            />
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {review.moves.map((move) => (
              <div
                key={move.moveIndex}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Move {move.moveIndex + 1}/{review.moves.length}
                  </span>
                  <span
                    className={
                      "rounded-full border px-2 py-0.5 text-xs font-medium " +
                      (move.quality === "strong"
                        ? "border-green-300 bg-green-100 text-green-700"
                        : move.quality === "adequate"
                          ? "border-blue-300 bg-blue-100 text-blue-700"
                          : move.quality === "needs_attention"
                            ? "border-yellow-300 bg-yellow-100 text-yellow-700"
                            : "border-red-300 bg-red-100 text-red-700")
                    }
                  >
                    {move.quality === "strong"
                      ? "Strong"
                      : move.quality === "adequate"
                        ? "Adequate"
                        : move.quality === "needs_attention"
                          ? "Needs Attention"
                          : "Needs Adjustment"}
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {String(move.score).padStart(2, "0")}/10
                </span>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleDownload}
          >
            Download report
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
