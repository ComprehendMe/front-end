import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  downloadChatReviewReport,
  getChatReview,
  listMessages,
  recomputeChatReview,
  waitForReviewReady,
  type Message,
  type ReviewResult,
} from "@/lib/api";
import { getPatientAvatar } from "@/lib/patient-avatar";
import { formatMessageTime } from "@/lib/format-message-time";
import { getInitials } from "@/lib/user-display";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/review/$chatId")({
  component: ReviewPage,
});

function formatReviewText(text: string, t: (key: string) => string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return t('dashboard.review.feedback_empty');
  }
  const looksLikeJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    trimmed.startsWith("```");
  if (looksLikeJson) {
    return t('dashboard.review.feedback_format_error');
  }
  return trimmed;
}

function ReviewPage() {
  const { chatId } = Route.useParams();
  const { user } = DashboardRoute.useRouteContext();
  const { t } = useTranslation();
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const totalMoves = review?.moves.length ?? 0;
  const currentAnalysis = review?.moves[currentMove - 1] ?? null;

  useEffect(() => {
    Promise.all([getChatReview(chatId), listMessages(chatId)])
      .then(([r, msgs]) => {
        setReview(r);
        setMessages(msgs);
      })
      .catch((e) => {
        toast.error(
          e instanceof ApiError ? e.message : t('dashboard.review.toast_load_error')
        );
      })
      .finally(() => setLoading(false));
  }, [chatId, t]);

  useEffect(() => {
    if (review?.reviewStatus !== "PENDING") return;
    let cancelled = false;
    void waitForReviewReady(chatId, 20, 1500)
      .then((next) => {
        if (!cancelled) setReview(next);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [chatId, review?.reviewStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const moveByMessageId = new Map(
    (review?.moves ?? []).map((move) => [move.messageId, move])
  );
  const userMessageIdsInOrder = messages
    .filter((m) => m.role === "user")
    .map((m) => m.id);
  const lastVisibleUserMessageId =
    currentMove > 0 ? userMessageIdsInOrder[currentMove - 1] : null;
  const visibleMessages =
    currentMove === 0 || !lastVisibleUserMessageId
      ? []
      : messages.slice(
          0,
          messages.findIndex((m) => m.id === lastVisibleUserMessageId) + 1
        );

  function handlePrev() {
    setCurrentMove((p) => Math.max(0, p - 1));
  }

  function handleNext() {
    setCurrentMove((p) => Math.min(totalMoves, p + 1));
  }

  async function handleDownload() {
    try {
      const blob = await downloadChatReviewReport(chatId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `review-${chatId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('dashboard.review.toast_download_error'));
    }
  }

  async function handleRecompute() {
    setRecomputing(true);
    try {
      await recomputeChatReview(chatId);
      const refreshed = await waitForReviewReady(chatId);
      setReview(refreshed);
      setCurrentMove(0);
      if (refreshed.reviewStatus === "FAILED") {
        toast.error(refreshed.errorMessage ?? t('dashboard.review.toast_recompute_generation_failed'));
      } else {
        toast.success(t('dashboard.review.toast_recompute_success'));
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : t('dashboard.review.toast_recompute_error')
      );
    } finally {
      setRecomputing(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {t('dashboard.review.loading_analysis')}
          </p>
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">{t('dashboard.review.not_available')}</p>
      </main>
    );
  }

  if (review.reviewStatus === "PENDING") {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">
            {t('dashboard.review.pending_title')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.review.pending_desc')}
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              const refreshed = await getChatReview(chatId);
              setReview(refreshed);
            }}
          >
            {t('dashboard.review.pending_refresh')}
          </Button>
        </div>
      </main>
    );
  }

  if (review.reviewStatus === "FAILED") {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-medium text-foreground">
            {t('dashboard.review.failed_title')}
          </p>
          <p className="text-sm text-muted-foreground">
            {review.errorMessage ?? t('dashboard.review.failed_default_error')}
          </p>
          <Button onClick={() => void handleRecompute()} disabled={recomputing}>
            {recomputing ? t('dashboard.review.failed_retrying_btn') : t('dashboard.review.failed_retry_btn')}
          </Button>
        </div>
      </main>
    );
  }

  function qualityLabel(quality: string) {
    switch (quality) {
      case "strong": return t('dashboard.review.badge_strong');
      case "adequate": return t('dashboard.review.badge_adequate');
      case "needs_attention": return t('dashboard.review.badge_needs_attention');
      default: return t('dashboard.review.badge_needs_adjustment');
    }
  }

  function qualityLabelShort(quality: string) {
    switch (quality) {
      case "strong": return t('dashboard.review.badge_strong_short');
      case "adequate": return t('dashboard.review.badge_adequate_short');
      case "needs_attention": return t('dashboard.review.badge_needs_attention_short');
      default: return t('dashboard.review.badge_needs_adjustment_short');
    }
  }

  return (
    <main className="mx-auto flex min-h-dynamic w-full max-w-[1700px] flex-col gap-fluid-md px-fluid-container py-fluid-section lg:h-dynamic lg:flex-row lg:gap-fluid-lg" style={{ minHeight: "calc(100dvh - 4rem)" }}>
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-fluid-xl font-semibold text-foreground">
              {t('dashboard.review.title')}
            </h1>
            <p className="text-fluid-sm text-muted-foreground">
              {t('dashboard.review.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-fluid-sm font-medium text-muted-foreground">
              {t('dashboard.review.move_label', { current: currentMove, total: totalMoves })}
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--dashboard-input)] sm:w-36">
              <div
                className="h-full rounded-full bg-[var(--dashboard-primary)] transition-all duration-300"
                style={{
                  width: `${totalMoves > 0 ? (currentMove / totalMoves) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-xl border p-fluid-md"
          style={{
            backgroundColor: "#F8FAFC",
            backgroundImage:
              "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          {currentMove === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
                <Avatar className="relative size-[clamp(5rem,20vw,7rem)] border-4 border-white shadow-lg">
                  <AvatarImage
                    src={getPatientAvatar(review.patient.name)}
                    alt={review.patient.name}
                  />
                  <AvatarFallback className="bg-[#F0F5FA] text-2xl font-semibold text-primary">
                    {review.patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <h2 className="text-fluid-3xl font-semibold leading-[1.1] text-[#1C1F22]">
                  {t('dashboard.review.start_title', { name: review.patient.name.split(" ")[0] })}
                </h2>
                <p className="mx-auto max-w-xl text-lg text-[#4B4E58]">
                  {review.patient.problem}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="rounded-full bg-[#1497D2] px-6 text-white hover:bg-[#2285B3]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t('dashboard.review.start_button')}
              </Button>
            </div>
          ) : (
            visibleMessages.map((msg, i) => {
            const isUser = msg.role === "user";
            const isFirstPatientMsg = i === 0 && !isUser;
            const patient = review.patient;

            if (isUser) {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {t('dashboard.review.me_label')}
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
                  <div className="max-w-[70%] rounded-2xl bg-[var(--dashboard-input)] px-4 py-3 text-sm text-foreground">
                    {msg.content}
                  </div>
                </div>
              );
            }

            const move = moveByMessageId.get(msg.id);
            return (
              <div key={msg.id} className="flex flex-col gap-1">
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
                <div className="ml-10 max-w-[70%] rounded-2xl bg-[var(--dashboard-soft)] px-4 py-3 text-sm text-foreground">
                  {msg.content}
                </div>
                {move ? (
                  <span className="ml-10 text-[11px] font-medium text-[var(--dashboard-primary)]">
                    Related to move {move.moveNumber}/{totalMoves}
                  </span>
                ) : null}
              </div>
            );
          })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col rounded-xl border bg-white p-fluid-md lg:max-w-[360px] xl:max-w-[390px]">
        <div className="mb-4">
          <h2 className="text-fluid-lg font-semibold text-foreground">
            {t('dashboard.review.performance_panel_title')}
          </h2>
          <p className="text-fluid-xs text-muted-foreground">{t('dashboard.review.performance_panel_subtitle')}</p>
        </div>

        {currentMove === 0 ? (
          <div className="flex flex-1 flex-col gap-3 text-sm text-foreground">
            <p className="font-semibold text-[var(--dashboard-primary)]">{t('dashboard.review.panel_not_started')}</p>
            <p className="text-muted-foreground">{t('dashboard.review.panel_no_moves')}</p>
            <p className="text-muted-foreground">
              {t('dashboard.review.panel_press_play')}
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
                {qualityLabel(currentAnalysis.quality)}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {currentAnalysis.category}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-foreground">
              {formatReviewText(currentAnalysis.feedback, t)
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
                  {t('dashboard.review.highlights_label')}
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
                  {t('dashboard.review.improvements_label')}
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
              {currentMove === 0 ? (
                <Play className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          {currentAnalysis && (
            <p className="text-sm font-medium">
              {t('dashboard.review.move_score', { score: currentAnalysis.score })}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t('dashboard.review.total_score', { score: review.totalScore })}
          </p>
          {currentMove >= totalMoves && totalMoves > 0 && (
            <Button
              className="w-full bg-[var(--dashboard-input)] text-[var(--dashboard-primary)] hover:bg-[#cfe5f4]"
              onClick={() => setSummaryOpen(true)}
            >
              {t('dashboard.review.view_summary')}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('dashboard.review.summary_title')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.review.summary_desc')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-around rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{review.totalScore}/100</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.review.summary_total_score')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{review.averageMove}/10</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.review.summary_avg_move')}</p>
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
              <button
                key={move.moveIndex}
                type="button"
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-gray-50"
                onClick={() => {
                  setCurrentMove(move.moveNumber);
                  setSummaryOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {t('dashboard.review.summary_move', { number: move.moveNumber, total: review.moves.length })}
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
                    {qualityLabelShort(move.quality)}
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {t('dashboard.review.summary_move_score', { score: String(move.score).padStart(2, "0") })}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => void handleRecompute()}
              disabled={recomputing}
            >
              {recomputing ? t('common.recomputing') : t('dashboard.review.dialog_recompute')}
            </Button>
            <Button className="flex-1" onClick={handleDownload}>
              {t('dashboard.review.dialog_download')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
