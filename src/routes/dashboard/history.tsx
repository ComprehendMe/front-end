import { columns, type Patients } from "@/components/tables/history/columns";
import { DataTable } from "@/components/tables/history/data-table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconDotsVertical } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryPage,
});

const data: Patients[] = [
  {
    id: "728ed52f",
    name: "Mariana Soares",
    problem: "Problems at school",
    difficult: "medium",
    analysis: "Review",
    duration: "45 minutes",
    ended: "about 2 hours ago",
  },
  {
    id: "728ed52f",
    name: "Leonardo da Silva",
    problem: "Relational and social problems",
    difficult: "easy",
    analysis: "Review",
    duration: "48 minutes",
    ended: "about 9 hours ago",
  },
  {
    id: "728ed52f",
    name: "Rafaela Silva",
    problem: "Problems at work/school",
    difficult: "hard",
    analysis: "Review",
    duration: "15 minutes",
    ended: "about 5 hours ago",
  },
];

function HistoryPage() {
  return (
    <main className="py-7">
      <div className="px-12 py-[38px] bg-white border border-[#1C1F22]/15 rounded-[20px] space-y-[34px] h-screen overflow-hidden">
        <h2 className="text-2xl font-semibold text-[#1C1F22]">History</h2>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
