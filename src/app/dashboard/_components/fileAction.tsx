import { Doc } from '../../../../convex/_generated/dataModel';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	MoreVertical,
	StarIcon,
	TrashIcon,
	UndoIcon,
	PencilIcon,
	StarOff,
	Share2,
	ArrowDownToLine,
	ArrowLeftRightIcon,
} from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Protect } from '@clerk/nextjs';

export function FileCardAction({
	file,
	isFavorited,
	isDocument,
	isPicture,
	isMusic,
	isVideo,
}: {
	readonly file: Doc<'files'> & { url: string | null };
	readonly isFavorited: boolean;
	readonly isDocument: boolean;
	readonly isPicture: boolean;
	readonly isMusic: boolean;
	readonly isVideo: boolean;
}) {
	const deleteFile = useMutation(api.files.deleteFile);
	const restoreFile = useMutation(api.files.restoreFile);
	const toggleFavorite = useMutation(api.files.toggleFavorite);
	const folderDocuments = useMutation(api.folder.folderDocuments);
	const folderPictures = useMutation(api.folder.folderPictures);
	const folderMusics = useMutation(api.folder.folderMusics);
	const folderVideos = useMutation(api.folder.folderVideos);

	const renameFile = useMutation(api.files.renameFile);
	const { toast } = useToast();
	const me = useQuery(api.users.getMe);
	const generateShareableLink = useMutation(api.files.generateShareableLink);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isRenameOpen, setIsRenameOpen] = useState(false);
	const [newName, setNewName] = useState('');
	const [shareableLink, setShareableLink] = useState<string | null>(null);
	const [isShareableLinkOpen, setIsShareableLinkOpen] = useState(false);

	const handleDownload = () => {
		if (!file.url) return;
		fetch(file.url)
			.then((response) => response.blob())
			.then((blob) => {
				const url = URL.createObjectURL(blob);
				const anchor = document.createElement('a');
				anchor.href = url;
				anchor.download = file.name;
				anchor.click();
				URL.revokeObjectURL(url);
			});
	};

	const handleToggleCategory = async (category: 'favorite' | 'document' | 'picture' | 'music' | 'video') => {
		if (category === 'favorite') {
			await toggleFavorite({ fileId: file._id });
		} else if (category === 'document') {
			await folderDocuments({ fileId: file._id });
		} else if (category === 'picture') {
			await folderPictures({ fileId: file._id });
		} else if (category === 'music') {
			await folderMusics({ fileId: file._id });
		} else if (category === 'video') {
			await folderVideos({ fileId: file._id });
		}
		toast({
			variant: 'default',
			title: `File telah diletakkan ke ${category}`,
		});
	};

	return (
		<>
			<AlertDialog
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Kamu yakin ingin menghapus file ini?</AlertDialogTitle>
						<AlertDialogDescription>
							Aksi ini hanya ditandai sebagai proses penghapusan file. Files masih ada di sampah sampai batas waktu yang
							telah ditentukan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batalkan</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await deleteFile({
									fileId: file._id,
									size: file.size,
								});
								toast({
									variant: 'destructive',
									title: 'File diletakkan disampah',
									description: 'File akan segera terhapus',
								});
							}}
						>
							Lanjutkan
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog
				open={isRenameOpen}
				onOpenChange={setIsRenameOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Ganti Nama File</AlertDialogTitle>
					</AlertDialogHeader>
					<div className='p-4'>
						<input
							type='text'
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							placeholder='Nama file baru	'
							className='w-full p-2 border border-gray-300 rounded'
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Batalkan</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await renameFile({
									fileId: file._id,
									newName: newName,
								});
								toast({
									variant: 'default',
									title: 'Nama file telah diganti',
									description: `File kamu namanya sekarang ${newName}`,
								});
								setIsRenameOpen(false);
							}}
						>
							Lanjutkan
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog
				open={isShareableLinkOpen}
				onOpenChange={setIsShareableLinkOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Link untuk membagikan File</AlertDialogTitle>
					</AlertDialogHeader>
					<div className='p-4'>
						{shareableLink ? (
							<input
								type='text'
								value={shareableLink}
								readOnly
								className='w-full p-2 border border-gray-300 rounded'
							/>
						) : (
							<button
								onClick={async () => {
									const link = await generateShareableLink({
										fileId: file._id,
									});
									setShareableLink(link);
									toast({
										variant: 'default',
										title: 'Shareable link generated',
										description: 'Sekarang kamu bisa share keorang lain',
									});
								}}
								className='w-full p-2 bg-black text-white rounded'
							>
								Generate Shareable Link
							</button>
						)}
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Tutup</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreVertical className='text-primary-foreground' />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							setIsRenameOpen(true);
						}}
						className='flex gap-1 items-center cursor-pointer'
					>
						<PencilIcon className='w-4 h-4' /> Ganti Nama
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleToggleCategory('favorite')}
						className='flex gap-1 items-center cursor-pointer'
					>
						{isFavorited ? (
							<div className='flex gap-1 items-center'>
								<StarOff className='w-4 h-4' /> Unfavorite
							</div>
						) : (
							<div className='flex gap-1 items-center'>
								<StarIcon className='w-4 h-4' /> Favorite
							</div>
						)}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<div className='flex gap-1 items-center cursor-pointer'>
								<ArrowLeftRightIcon className=' w-4 h-4' />
								Pindah
							</div>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									onClick={() => handleToggleCategory('document')}
									className='flex gap-1 items-center cursor-pointer'
								>
									{isDocument ? (
										<div className='flex gap-1 items-center'>Hapus dari Document</div>
									) : (
										<div className='flex gap-1 items-center'>Pindahkan ke Document</div>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleToggleCategory('picture')}
									className='flex gap-1 items-center cursor-pointer'
								>
									{isPicture ? (
										<div className='flex gap-1 items-center'>Hapus dari Picture</div>
									) : (
										<div className='flex gap-1 items-start'>Pindahkan ke Picture</div>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleToggleCategory('music')}
									className='flex gap-1 items-center cursor-pointer'
								>
									{isMusic ? (
										<div className='flex gap-1 items-center'>Hapus dari Music</div>
									) : (
										<div className='flex gap-1 items-center'>Pindahkan ke Music</div>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleToggleCategory('video')}
									className='flex gap-1 items-center cursor-pointer'
								>
									{isVideo ? (
										<div className='flex gap-1 items-center'>Hapus dari Video</div>
									) : (
										<div className='flex gap-1 items-center'>Pindahkan ke Video</div>
									)}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem
						onClick={() => {
							setIsShareableLinkOpen(true);
						}}
						className='flex gap-1 items-center cursor-pointer'
					>
						<Share2 className='w-4 h-4' />
						Bagikan
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleDownload}
						className='flex gap-1 items-center cursor-pointer'
					>
						<ArrowDownToLine className='w-4 h-4' /> Download
					</DropdownMenuItem>
					<Protect
						condition={(check) => {
							return (
								check({
									role: 'org:admin',
								}) || file.userId === me?._id
							);
						}}
						fallback={<></>}
					>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								if (file.shouldDelete) {
									restoreFile({
										fileId: file._id,
									});
								} else {
									setIsConfirmOpen(true);
								}
							}}
							className='flex gap-1 items-center cursor-pointer'
						>
							{file.shouldDelete ? (
								<div className='flex gap-1 text-green-600 items-center cursor-pointer'>
									<UndoIcon className='w-4 h-4' /> Kembalikan
								</div>
							) : (
								<div className='flex gap-1 text-red-600 items-center cursor-pointer'>
									<TrashIcon className='w-4 h-4' /> Hapus
								</div>
							)}
						</DropdownMenuItem>
					</Protect>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
