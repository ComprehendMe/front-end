"use client";

import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { MoreHorizontal, Trash } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type HistoryRow = {
  id: string;
  chatId: string;
  name: string;
  problem: string;
  difficult: "easy" | "medium" | "hard";
  ended: string;
  duration: string;
  analysis: string;
  patientImageUrl: string;
  pausedAt: string | null;
};

type HistoryColumnsOptions = {
  onDelete: (chatId: string) => void;
  t: TFunction;
};

export function createHistoryColumns({
  onDelete,
  t,
}: HistoryColumnsOptions): ColumnDef<HistoryRow>[] {

  return [
    {
      accessorKey: "patient",
      header: t('dashboard.history.table_header_patients'),
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-[54px] w-[54px]">
              <AvatarImage src={patient.patientImageUrl} alt={patient.name} loading="lazy" />
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{patient.name}</p>
              <span className="text-xs font-normal text-muted-foreground">
                {patient.problem}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "difficult",
      header: t('dashboard.history.table_header_difficult'),
      cell: ({ row }) => {
        const { difficult } = row.original;
        return <Badge variant={difficult} />;
      },
    },
    {
      accessorKey: "ended",
      header: t('dashboard.history.table_header_ended'),
    },
    {
      accessorKey: "duration",
      header: t('dashboard.history.table_header_duration'),
    },
    {
      accessorKey: "analysis",
      header: t('dashboard.history.table_header_analysis'),
      cell: ({ row }) => {
        const isPaused = !!row.original.pausedAt;
        return (
          <div className="flex items-center gap-3">
            {isPaused ? (
              <span className="cursor-not-allowed text-sm font-medium text-muted-foreground">
                {t('dashboard.history.review_link_disabled')}
              </span>
            ) : (
              <Link
                to="/dashboard/review/$chatId"
                params={{ chatId: row.original.chatId }}
                className="text-sm font-medium text-[#1497D2] hover:underline"
              >
                {t('dashboard.history.review_link')}
              </Link>
            )}
          </div>
        );
      },
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('dashboard.history.table_action_open_menu_sr')}</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0">
            <DropdownMenuItem
              className="bg-blue-100 text-[#1C1F22]"
              onClick={() => onDelete(row.original.chatId)}
            >
              <Trash />
              <span className="text-sm font-medium">{t('dashboard.history.table_action_delete')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
