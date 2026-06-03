import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, MoreVertical, Pause, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChatComposer } from "@/components/dashboard/chat/chat-composer";
import { ChatMessageRow } from "@/components/dashboard/chat/chat-message-row";
import { PauseConversationDialog } from "@/components/dashboard/chat/pause-conversation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConversationGuard } from "@/hooks/use-conversation-guard";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import {
  ApiError,
  endChat,
  getChat,
  listMessages,
  listPatients,
  pauseChat,
  sendMessage,
  waitForModelReply,
  type Message,
  type Patient,
} from "@/lib/api";
import {
  getPatientFirstName,
  getGreetingKey,
} from "@/lib/format-message-time";
import { getPatientAvatar } from "@/lib/patient-avatar";
import { getInitials } from "@/lib/user-display";
import { Route as DashboardRoute } from "../dashboard";

export const Route = createFileRoute("/dashboard/chat/$chatId")({
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = DashboardRoute.useRouteContext();
  const { t } = useTranslation();
  const { preferences } = useUserPreferences(user.email);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientAvatarUrl, setPatientAvatarUrl] = useState("");
  const [chatEnded, setChatEnded] = useState(false);
  const [chatPaused, setChatPaused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [waitingReply, setWaitingReply] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [reviewPromptOpen, setReviewPromptOpen] = useState(false);
  const skipBlockRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userInitials = getInitials(user);
  const userLabel = t('dashboard.chat.user_label');
  const hasMessages = messages.length > 0;
  const messagesSentToday = messages.filter((m) => m.role === "user").length;
  const isActiveConversation = hasMessages && !chatEnded && !chatPaused;

  const { dialogOpen, pausing, confirmPause, cancelLeave } =
    useConversationGuard({
      chatId,
      isActive: isActiveConversation,
      skipBlockRef,
    });

  const loadChat = useCallback(async () => {
    try {
      const [chat, msgs] = await Promise.all([
        getChat(chatId),
        listMessages(chatId),
        listPatients(),
      ]);
      setPatient(chat.patient);
      setPatientAvatarUrl(getPatientAvatar(chat.patient.name));
      setChatEnded(Boolean(chat.endedAt));
      setChatPaused(Boolean(chat.pausedAt));
      setMessages(msgs);
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : t('dashboard.chat.toast_load_error')
      );
    } finally {
      setLoading(false);
    }
  }, [chatId, t]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending || waitingReply || chatEnded) return;

    setSending(true);
    setInput("");
    const previousModelCount = messages.filter(
      (m) => m.role === "model"
    ).length;

    try {
      await sendMessage(chatId, text);
      setChatPaused(false);
      const updated = await listMessages(chatId);
      setMessages(updated);
      setWaitingReply(true);

      const reply = await waitForModelReply(chatId, previousModelCount);
      const finalMessages = await listMessages(chatId);
      setMessages(finalMessages);

      if (!reply) {
        toast.error(t('dashboard.chat.toast_no_reply'));
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : t('dashboard.chat.toast_send_error')
      );
      setInput(text);
    } finally {
      setSending(false);
      setWaitingReply(false);
    }
  }

  async function handlePauseFromMenu() {
    if (chatPaused) {
      skipBlockRef.current = true;
      await navigate({ to: "/dashboard" });
      skipBlockRef.current = false;
      return;
    }

    setMenuLoading(true);
    try {
      await pauseChat(chatId);
      setChatPaused(true);
      toast.success(t('dashboard.chat.toast_pause_success'));
      skipBlockRef.current = true;
      await navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : t('dashboard.chat.toast_pause_error')
      );
    } finally {
      skipBlockRef.current = false;
      setMenuLoading(false);
    }
  }

  async function handleEndConversation() {
    setMenuLoading(true);
    try {
      await endChat(chatId);
      setChatEnded(true);
      setChatPaused(false);
      toast.success(t('dashboard.chat.toast_end_success'));
      setReviewPromptOpen(true);
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : t('dashboard.chat.toast_end_error')
      );
    } finally {
      skipBlockRef.current = false;
      setMenuLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  const patientFirstName = getPatientFirstName(patient.name);
  const inputDisabled = sending || waitingReply || chatEnded;
  const showPausedBanner = chatPaused && !chatEnded;
  const showEndedBanner = chatEnded;

  return (
    <>
      <Dialog open={reviewPromptOpen} onOpenChange={setReviewPromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.chat.dialog_end_title')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.chat.dialog_end_desc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setReviewPromptOpen(false);
                void navigate({ to: "/dashboard/history" });
              }}
            >
              {t('dashboard.chat.dialog_end_maybe_later')}
            </Button>
            <Button
              onClick={() => {
                setReviewPromptOpen(false);
                void navigate({
                  to: "/dashboard/review/$chatId",
                  params: { chatId },
                });
              }}
            >
              {t('dashboard.chat.dialog_end_review_now')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PauseConversationDialog
        open={dialogOpen}
        onConfirm={() => void confirmPause()}
        onCancel={cancelLeave}
        loading={pausing}
      />

      <div className="mt-4 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ minHeight: "calc(100dvh - 10rem)" }}>
        <div className="flex items-center justify-end border-b px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                disabled={menuLoading || !hasMessages}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => void handlePauseFromMenu()}
                disabled={chatEnded}
              >
                <Pause className="h-4 w-4" />
                {chatPaused ? t('dashboard.chat.menu_back_to_dashboard') : t('dashboard.chat.menu_pause')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void handleEndConversation()}
                disabled={chatEnded}
              >
                <Square className="h-4 w-4" />
                {t('dashboard.chat.menu_end')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showEndedBanner && (
          <div className="border-b bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
            {t('dashboard.chat.ended_banner')}
          </div>
        )}
        {showPausedBanner && (
          <div className="border-b bg-[#F0F5FA] px-4 py-2 text-center text-sm text-[#0978AA]">
            {t('dashboard.chat.paused_banner')}
          </div>
        )}

        <div
          className="flex flex-1 flex-col overflow-hidden"
          style={{
            backgroundColor: "#F8FAFC",
            backgroundImage:
              "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <div className="flex flex-1 flex-col overflow-y-auto px-fluid-container py-fluid-section">
            {!hasMessages ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 scale-110 rounded-full bg-[#1497D2]/20 blur-xl" />
                  <Avatar className="relative size-[clamp(5rem,20vw,7rem)] border-4 border-white shadow-lg">
                    <AvatarImage
                      src={patientAvatarUrl}
                      alt={patient.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#F0F5FA] text-2xl font-semibold text-primary">
                      {patientFirstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="max-w-lg space-y-2">
                  <h2 className="text-fluid-xl font-bold text-foreground">
                    {t('dashboard.chat.empty_greeting', { greeting: t(getGreetingKey()), name: patientFirstName })}
                  </h2>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {patient.problem}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-6">
                {messages.map((msg) => (
                  <ChatMessageRow
                    key={msg.id}
                    message={msg}
                    patientName={patient.name}
                    patientAvatarUrl={patientAvatarUrl}
                    userLabel={userLabel}
                    userAvatarUrl={user.avatar}
                    userInitials={userInitials}
                    timeFormat={preferences.timeFormat}
                  />
                ))}
                {waitingReply && (
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={patientAvatarUrl} alt={patient.name} />
                      <AvatarFallback>
                        {patientFirstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#F0F5FA] px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('dashboard.chat.waiting_reply')}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-[#E8EEF4]/80 bg-white/80 px-fluid-container py-fluid-section backdrop-blur-sm pb-safe-bottom">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={() => void handleSend()}
              disabled={inputDisabled}
              messagesSentToday={messagesSentToday}
            />
          </div>
        </div>
      </div>
    </>
  );
}
