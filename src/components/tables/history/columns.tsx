"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import type { JSX } from "react";

export type Patients = {
  id: string;
  name: string;
  problem: string;
  difficult: "easy" | "medium" | "hard";
  ended: string;
  duration: string;
  analysis: string;
};

export const columns: ColumnDef<Patients>[] = [
  {
    accessorKey: "patient",
    header: "Patients",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="w-[54px] h-[54px]">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{patient.name}</p>
            <span className="font-normal text-xs">{patient.problem}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "difficult",
    header: "Difficult",
    cell: ({ row }) => {
      const { difficult } = row.original;
      return <Badge variant={difficult} />;
    },
  },
  {
    accessorKey: "ended",
    header: "Ended",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "analysis",
    header: "Analysis",
  },
  {
    id: "action",
    enableHiding: false,
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0">
            <DropdownMenuItem className="text-[#1C1F22] bg-blue-100">
              <Trash />
              <span className="text-sm font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
