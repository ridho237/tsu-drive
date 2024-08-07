'use client';
import { useState, ReactNode } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Image from 'next/image';
import { formatRelative } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileCardAction } from './fileAction';
import {
	ImageIcon,
	GanttChartIcon,
	FilePenIcon,
	FileSpreadsheetIcon,
	FilePieChartIcon,
	FilePlusIcon,
	FilmIcon,
	MusicIcon,
	FileArchive,
} from 'lucide-react';

export function FileCard({
	file,
}: {
	readonly file: Doc<'files'> & {
		isFavorited: boolean;
		isDocument: boolean;
		isPicture: boolean;
		isMusic: boolean;
		isVideo: boolean;
		url: string | null;
	};
}) {
	const userProfile = useQuery(api.users.getUserProfile, {
		userId: file.userId,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);

	const typeIcons = {
		jpeg: <ImageIcon />,
		png: <ImageIcon />,
		video: <FilmIcon />,
		audio: <MusicIcon />,
		pdf: <FilePlusIcon />,
		csv: <GanttChartIcon />,
		word: <FilePenIcon />,
		excel: <FileSpreadsheetIcon />,
		powerpoint: <FilePieChartIcon />,
		zip: <FileArchive />,
		rar: <FileArchive />,
	} as Record<Doc<'files'>['type'], ReactNode>;

	const extension = {
		jpeg: '.jpg',
		png: '.png',
		pdf: '.pdf',
		video: '.mp4',
		audio: '.mp3',
		csv: '.csv',
		word: '.docx',
		excel: '.xlsx',
		powerpoint: '.pptx',
		zip: '.zip',
		rar: '.rar',
	} as Record<Doc<'files'>['type'], ReactNode>;

	return (
		<div>
			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			>
				<Card className='auto-rows-max'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='flex gap-2 items-center text-primary-foreground'>
							<div className='flex justify-center'>{typeIcons[file.type]}</div>
							{file.name}
							{extension[file.type]}
						</CardTitle>
						<div className='items-center'>
							<FileCardAction
								isFavorited={file.isFavorited}
								isDocument={file.isDocument}
								isPicture={file.isPicture}
								isMusic={file.isMusic}
								isVideo={file.isVideo}
								file={file}
							/>
						</div>
					</CardHeader>
					<DialogTrigger asChild>
						<CardContent className='h-[200px]'>
							<div className='flex justify-center'>
								{file.type === 'jpeg' && file.url && (
									<Image
										alt={file.name}
										width='200'
										height='200'
										src={file.url}
										className='h-[150px] w-72 object-cover rounded-2xl'
									/>
								)}
							</div>
							<div className='flex justify-center'>
								{file.type === 'png' && file.url && (
									<Image
										alt={file.name}
										width='200'
										height='200'
										src={file.url}
										className='h-[150px] w-72 object-cover rounded-2xl'
									/>
								)}
							</div>
							<div className='flex justify-center'>
								{file.type === 'video' && file.url && (
									<iframe
										title={file.name}
										src={file.url}
										allowFullScreen
										className='h-[150px] w-full object-cover rounded-2xl'
									/>
								)}
							</div>
							<div className='flex justify-center'>
								{file.type === 'audio' && file.url && (
									<audio
										controls
										className='pt-2 mt-5'
									>
										<source
											src={file.url}
											type='audio/mp3'
										/>
									</audio>
								)}
							</div>
							<div className='flex justify-center text-primary-foreground'>
								{file.type === 'csv' && <GanttChartIcon className='flex justify-center w-32 h-32'></GanttChartIcon>}
							</div>
							<div className='flex justify-center text-primary-foreground'>
								{file.type === 'pdf' && <FilePlusIcon className='flex justify-center w-32 h-32'></FilePlusIcon>}
							</div>
							<div className='flex justify-center text-primary-foreground'>
								{file.type === 'zip' && <FileArchive className='flex justify-center w-32 h-32'></FileArchive>}
							</div>
							<div className='flex justify-center text-primary-foreground'>
								{file.type === 'rar' && <FileArchive className='flex justify-center w-32 h-32'></FileArchive>}
							</div>
							<div className='flex justify-center '>
								{file.type === 'word' && (
									<Image
										src='/filetype/word.svg'
										alt='word'
										width={140}
										height={140}
									></Image>
								)}
							</div>
							<div className='flex justify-center'>
								{file.type === 'excel' && (
									<Image
										src='/filetype/excel.svg'
										alt='excel'
										width={140}
										height={140}
									></Image>
								)}
							</div>
							<div className='flex justify-center'>
								{file.type === 'powerpoint' && (
									<Image
										src='/filetype/powerpoint.svg'
										alt='ppt'
										width={140}
										height={140}
									></Image>
								)}
							</div>
						</CardContent>
					</DialogTrigger>
					<CardFooter className='flex flex-row justify-between'>
						<div className='flex gap-2 text-[10px] text-primary-foreground items-center'>
							<Avatar className='w-6 h-6 z-0'>
								<AvatarImage src={userProfile?.image} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							{userProfile?.name}
						</div>
						<div className='text-[10px] w-[90px] text-primary-foreground'>
							Di Upload{' '}
							{formatRelative(new Date(file._creationTime), new Date(), {
								locale: id,
							})}
						</div>
					</CardFooter>
				</Card>

				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-primary'>File Preview</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<div className='flex justify-center pt-5'>
							{file.type === 'jpeg' && file.url && (
								<Image
									alt={file.name}
									width='400'
									height='400'
									src={file.url}
									className='h-[300px] w-full object-cover rounded-2xl'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'png' && file.url && (
								<Image
									alt={file.name}
									width='400'
									height='400'
									src={file.url}
									className='h-[300px] w-full object-cover rounded-2xl'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'video' && file.url && (
								<iframe
									title={file.name}
									src={file.url}
									allowFullScreen
									className='h-[300px] w-full object-cover rounded-2xl'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'audio' && file.url && (
								<audio
									controls
									className='pt-2 mt-5 w-full'
								>
									<source
										src={file.url}
										type='audio/mp3'
									/>
								</audio>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'pdf' && file.url && (
								<iframe
									title={file.name}
									src={file.url}
									className='h-[300px] w-full object-cover'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'word' && file.url && (
								<iframe
									title={file.name}
									src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
									className='h-[300px] w-full object-cover'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'excel' && file.url && (
								<iframe
									title={file.name}
									src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
									className='h-[300px] w-full object-cover'
								/>
							)}
						</div>
						<div className='flex justify-center'>
							{file.type === 'powerpoint' && file.url && (
								<iframe
									title={file.name}
									src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
									className='h-[300px] w-full object-cover'
								/>
							)}
						</div>
					</DialogDescription>
					<DialogClose
						className='text-primary'
						asChild
					></DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	);
}
