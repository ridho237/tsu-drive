'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { formatRelative } from 'date-fns';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileCardAction } from './fileAction';

function UserCell({ userId }: { readonly userId: Id<'users'> }) {
	const userProfile = useQuery(api.users.getUserProfile, {
		userId: userId,
	});
	return (
		<div className='flex gap-2 text-xs text-primary-foreground w-40 items-center'>
			<Avatar className='w-6 h-6'>
				<AvatarImage src={userProfile?.image} />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			{userProfile?.name}
		</div>
	);
}

export const columns: readonly ColumnDef<
	Doc<'files'> & {
		url: string;
		isFavorited: boolean;
		isDocument: boolean;
		isPicture: boolean;
		isMusic: boolean;
		isVideo: boolean;
	}
>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'type',
		header: 'Type',
	},
	{
		header: 'User',
		cell: ({ row }) => {
			return <UserCell userId={row.original.userId} />;
		},
	},
	{
		header: 'Diupload',
		cell: ({ row }) => {
			return <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>;
		},
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return (
				<div>
					<FileCardAction
						file={row.original}
						isFavorited={row.original.isFavorited}
						isDocument={row.original.isDocument}
						isPicture={row.original.isPicture}
						isMusic={row.original.isMusic}
						isVideo={row.original.isVideo}
					/>
				</div>
			);
		},
	},
];
