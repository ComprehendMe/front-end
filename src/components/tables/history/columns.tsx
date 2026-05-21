'use client';

import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type HistoryRow = {
	id: string;
	chatId: string;
	name: string;
	problem: string;
	difficult: 'easy' | 'medium' | 'hard';
	ended: string;
	duration: string;
	analysis: string;
	patientImageUrl: string;
};

type HistoryColumnsOptions = {
	onDelete: (chatId: string) => void;
};

export function createHistoryColumns({
	onDelete,
}: HistoryColumnsOptions): ColumnDef<HistoryRow>[] {
	return [
		{
			accessorKey: 'patient',
			header: 'Patients',
			cell: ({ row }) => {
				const patient = row.original;
				return (
					<div className="flex items-center space-x-2">
						<Avatar className="h-[54px] w-[54px]">
							<AvatarImage src={patient.patientImageUrl} alt={patient.name} />
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
			accessorKey: 'difficult',
			header: 'Difficult',
			cell: ({ row }) => {
				const { difficult } = row.original;
				return <Badge variant={difficult} />;
			},
		},
		{
			accessorKey: 'ended',
			header: 'Ended',
		},
		{
			accessorKey: 'duration',
			header: 'Duration',
		},
		{
			accessorKey: 'analysis',
			header: 'Analysis',
			cell: ({ row }) => (
				<div className="flex items-center gap-3">
					<Link
						to="/dashboard/chat/$chatId"
						params={{ chatId: row.original.chatId }}
						className="text-sm font-medium text-[#1497D2] hover:underline"
					>
						Review
					</Link>
				</div>
			),
		},
		{
			id: 'action',
			enableHiding: false,
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="p-0">
						<DropdownMenuItem
							className="bg-blue-100 text-[#1C1F22]"
							onClick={() => onDelete(row.original.chatId)}
						>
							<Trash />
							<span className="text-sm font-medium">Excluir</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];
}
