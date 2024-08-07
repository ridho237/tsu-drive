'use client';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { UploadButton } from './uploadButton';
import { FileCard } from './fileCard';
import Image from 'next/image';
import { Fan, GridIcon, RowsIcon } from 'lucide-react';
import { SearchBar } from './searchBar';
import { useState } from 'react';
import { DataTable } from './fileTable';
import { columns } from './columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Doc } from '../../../../convex/_generated/dataModel';
import { Label } from '@/components/ui/label';

function Placeholder() {
	return (
		<div className='flex flex-col gap-8 w-full items-center mt-24'>
			<Image
				alt='an image of a picture and directory icon'
				width='300'
				height='300'
				src='/empty.svg'
			/>
			<div className='text-2xl text-center text-primary'>kamu tidak ada file, Upload sekarang</div>
			<UploadButton />
		</div>
	);
}

export function FileBrowser({
	title,
	favoritesOnly,
	documentOnly,
	pictureOnly,
	musicOnly,
	videoOnly,
	deletedOnly,
}: {
	readonly title: string;
	readonly favoritesOnly?: boolean;
	readonly documentOnly?: boolean;
	readonly pictureOnly?: boolean;
	readonly musicOnly?: boolean;
	readonly videoOnly?: boolean;
	readonly deletedOnly?: boolean;
}) {
	const organization = useOrganization();
	const user = useUser();
	const [query, setQuery] = useState('');
	const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all');

	let orgId: string | undefined = undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}

	const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : 'skip');
	const document = useQuery(api.folder.getAllDocuments, orgId ? { orgId } : 'skip');
	const picture = useQuery(api.folder.getAllPictures, orgId ? { orgId } : 'skip');
	const music = useQuery(api.folder.getAllMusics, orgId ? { orgId } : 'skip');
	const video = useQuery(api.folder.getAllVideos, orgId ? { orgId } : 'skip');

	const files = useQuery(
		api.files.getFiles,
		orgId
			? {
					orgId,
					type: type === 'all' ? undefined : type,
					query,
					favorites: favoritesOnly,
					documents: documentOnly,
					pictures: pictureOnly,
					musics: musicOnly,
					videos: videoOnly,
					deletedOnly,
				}
			: 'skip'
	);
	const isLoading = files === undefined;

	const modifiedFiles =
		files?.map((file) => ({
			...file,
			isFavorited: (favorites ?? []).some((favorite) => favorite.fileId === file._id),
			isDocument: (document ?? []).some((documents) => documents.fileId === file._id),
			isPicture: (picture ?? []).some((pictures) => pictures.fileId === file._id),
			isMusic: (music ?? []).some((musics) => musics.fileId === file._id),
			isVideo: (video ?? []).some((videos) => videos.fileId === file._id),
		})) ?? [];

	return (
		<div>
			<div className='flex flex-wrap flex-col gap-5 justify-between items-center mb-8 md:flex-row'>
				<h1 className='text-3xl font-bold text-primary'>{title}</h1>
				<SearchBar
					query={query}
					setQuery={setQuery}
				/>
			</div>
			<Tabs defaultValue='grid'>
				<div className='flex justify-between items-center flex-wrap mb-10'>
					<div className='flex items-center '>
						<TabsList>
							<TabsTrigger
								value='grid'
								className='flex gap-2 items-center'
							>
								<GridIcon />
								Grid
							</TabsTrigger>
							<TabsTrigger
								value='table'
								className='flex gap-2 items-center'
							>
								<RowsIcon /> Table
							</TabsTrigger>
						</TabsList>
					</div>
					<div className='flex gap-2 items-center'>
						<Label
							htmlFor='type-select'
							className='hidden sm:flex text-primary'
						>
							Type Filter
						</Label>
						<Select
							value={type}
							onValueChange={(newType) => {
								setType(newType as any);
							}}
						>
							<SelectTrigger
								id='type-select'
								className='w-[90px] md:w-[180px] bg-primary text-primary-foreground'
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className='bg-primary text-primary-foreground'>
								<SelectItem value='all'>Semua</SelectItem>
								<SelectItem value='jpeg'>JPG</SelectItem>
								<SelectItem value='png'>PNG</SelectItem>
								<SelectItem value='audio'>Music</SelectItem>
								<SelectItem value='video'>Video</SelectItem>
								<SelectItem value='csv'>CSV</SelectItem>
								<SelectItem value='pdf'>PDF</SelectItem>
								<SelectItem value='word'>Word</SelectItem>
								<SelectItem value='excel'>Excel</SelectItem>
								<SelectItem value='powerpoint'>PPT</SelectItem>
								<SelectItem value='zip'>Zip Archive</SelectItem>
								<SelectItem value='rar'>Rar Archive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{isLoading && (
					<div className='flex flex-col gap-8 w-full items-center mt-24'>
						<Fan className='h-32 w-32 animate-spin text-primary' />
						<div className='text-2xl text-primary'>Tunggu Sebentar...</div>
					</div>
				)}

				<TabsContent value='grid'>
					<div className='grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3'>
						{modifiedFiles?.map((file) => {
							return (
								<FileCard
									key={file._id}
									file={file}
								/>
							);
						})}
					</div>
				</TabsContent>

				<TabsContent value='table'>
					<div className='text-primary-foreground'>
						<DataTable
							columns={columns}
							data={modifiedFiles}
						/>
					</div>
				</TabsContent>
			</Tabs>

			{files?.length === 0 && <Placeholder />}
		</div>
	);
}
