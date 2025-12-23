import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <main className="py-7">
      <div className="px-12 py-[38px] bg-white border border-[#1C1F22]/15 rounded-[20px] space-y-[34px]">
        <h2 className="text-2xl font-semibold text-[#1C1F22]">History</h2>
        <Table>
          <TableHeader>
            <TableHead className="text-[16px] font-semibold text-[#1C1F22]">
              Patients
            </TableHead>
            <TableHead className="text-[16px] font-semibold text-[#1C1F22]">
              Difficult
            </TableHead>
            <TableHead className="text-[16px] font-semibold text-[#1C1F22]">
              Ended
            </TableHead>
            <TableHead className="text-[16px] font-semibold text-[#1C1F22]">
              Duration
            </TableHead>
            <TableHead className="text-[16px] font-semibold text-[#1C1F22]">
              Analysis
            </TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium flex gap-2.5">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-[#1C1F22]">
                    John Doe
                  </p>
                  <span className="text-xs font-normal  text-gray-500">
                    john.doe@example.com
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge>Medium</Badge>
              </TableCell>
              <TableCell className="font-medium text-[16px]">
                about 2 hours ago
              </TableCell>
              <TableCell className="font-medium text-[16px]">45 minutos</TableCell>
              <TableCell className="font-medium text-[16px]">Review</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium flex gap-2.5">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-[#1C1F22]">
                    John Doe
                  </p>
                  <span className="text-xs font-normal  text-gray-500">
                    john.doe@example.com
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge>Medium</Badge>
              </TableCell>
              <TableCell className="font-medium text-[16px]">
                about 2 hours ago
              </TableCell>
              <TableCell className="font-medium text-[16px]">45 minutos</TableCell>
              <TableCell className="font-medium text-[16px]">Review</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
