'use client';
import {
	CloudIcon,
	FileAudio2Icon,
	FileImageIcon,
	FileTextIcon,
	FileVideoIcon,
	FilesIcon,
	StarIcon,
	TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ProgressBar } from './_components/progressBar';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

import { useOrganization, useUser } from '@clerk/nextjs';
import { UploadButton } from './_components/uploadButton';

export function SideNavbar() {
	const organization = useOrganization();
	const user = useUser();

	const MAX_STORAGE_MB = 500;

	let orgId: string | undefined = undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}

	const storageUsed = useQuery(
		api.files.getStorageUsed,
		orgId
			? {
					orgId,
				}
			: 'skip'
	);

	let storageUsedNumber: number;
	if (typeof storageUsed === 'number') {
		storageUsedNumber = storageUsed;
	} else {
		storageUsedNumber = 0;
	}
	const pathname = usePathname();
	const storageProgress = (storageUsedNumber / MAX_STORAGE_MB) * 100;

	return (
		<main>
			<div className='hidden h-screen sm:flex flex-col gap-5 w-[180px]'>
				<UploadButton />
				<Link
					href='/dashboard/allFiles'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/allFiles'),
					})}
				>
					<FilesIcon />
					Semua File
				</Link>
				<Link
					href='/dashboard/favorites'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/favorites'),
					})}
				>
					<StarIcon />
					Favorite
				</Link>
				<div className='h-[2px] rounded-full w-full bg-primary'></div>
				<Link
					href='/dashboard/document'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/document'),
					})}
				>
					<FileTextIcon />
					Document
				</Link>
				<Link
					href='/dashboard/picture'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/picture'),
					})}
				>
					<FileImageIcon />
					Picture
				</Link>
				<Link
					href='/dashboard/music'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/music'),
					})}
				>
					<FileAudio2Icon />
					Music
				</Link>
				<Link
					href='/dashboard/video'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/video'),
					})}
				>
					<FileVideoIcon />
					Video
				</Link>
				<div className='h-[2px] rounded-full w-full bg-primary'></div>
				<Link
					href='/dashboard/trash'
					className={clsx('text-primary flex p-2 -ml-5 sm:mx-0 gap-2', {
						'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/trash'),
					})}
				>
					<TrashIcon /> Sampah
				</Link>
				<div className='rounded-lg px-2 bg-primary-foreground border-2'>
					<h1 className='flex gap-2 mt-3 text-primary'>
						<CloudIcon />
						Penyimpanan
					</h1>
					<h3 className='mb-3 text-primary'>
						{typeof storageUsed === 'number' ? storageUsed.toFixed(2) : '0.00'} MB / {MAX_STORAGE_MB} MB
					</h3>
					<ProgressBar progress={storageProgress} />
				</div>
			</div>

			<div className='flex sm:hidden justify-center'>
				<div className='w-full flex flex-col items-center gap-2'>
					<div className='w-full'>
						<div className='flex flex-row justify-between items-center border-2 rounded-lg gap-2 p-2'>
							<Link
								href='/dashboard/favorites'
								className={clsx('text-primary flex py-2 px-[6%] rounded-md border-2', {
									'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/favorites'),
								})}
							>
								<StarIcon />
							</Link>
							<Link
								href='/dashboard/trash'
								className={clsx('text-primary flex py-2 px-[6%] rounded-md border-2', {
									'bg-primary rounded-md text-secondary': pathname.includes('/dashboard/trash'),
								})}
							>
								<TrashIcon />
							</Link>
							<UploadButton />
						</div>
					</div>
					<div className='w-full p-2 border-b-2 mt-5'>
						<h1 className='flex flex-cols justify-center gap-2 mb-3 text-primary text-sm'>
							<CloudIcon />
							Penyimpanan {''}
							{typeof storageUsed === 'number' ? storageUsed.toFixed(2) : '0.00'} MB / {MAX_STORAGE_MB} MB
						</h1>
						<ProgressBar progress={storageProgress} />
					</div>
				</div>
			</div>

			<div className='fixed z-10 bottom-0 left-0 sm:hidden w-full'>
				<div className='w-full'>
					<div className='flex flex-row justify-between bg-white border-t-2 p-5'>
						<Link
							href='/dashboard/allFiles'
							className={clsx('text-primary flex p-2 rounded-md border-2', {
								'bg-primary rounded-md text-secondary gap-1': pathname.includes('/dashboard/allFiles'),
							})}
						>
							<FilesIcon />
							<p
								className={clsx({
									hidden: !pathname.includes('/dashboard/allFiles'),
									'flex text-center': pathname.includes('/dashboard/allFiles'),
								})}
							>
								Semua Files
							</p>
						</Link>
						<Link
							href='/dashboard/document'
							className={clsx('text-primary flex p-2 rounded-md border-2', {
								'bg-primary rounded-md text-secondary gap-1': pathname.includes('/dashboard/document'),
							})}
						>
							<FileTextIcon />
							<p
								className={clsx({
									hidden: !pathname.includes('/dashboard/document'),
									'flex text-center': pathname.includes('/dashboard/document'),
								})}
							>
								Document
							</p>
						</Link>
						<Link
							href='/dashboard/picture'
							className={clsx('text-primary flex p-2 rounded-md border-2', {
								'bg-primary rounded-md text-secondary gap-1': pathname.includes('/dashboard/picture'),
							})}
						>
							<FileImageIcon />
							<p
								className={clsx({
									hidden: !pathname.includes('/dashboard/picture'),
									'flex text-center': pathname.includes('/dashboard/picture'),
								})}
							>
								Picture
							</p>
						</Link>
						<Link
							href='/dashboard/music'
							className={clsx('text-primary flex p-2 rounded-md border-2', {
								'bg-primary rounded-md text-secondary gap-1': pathname.includes('/dashboard/music'),
							})}
						>
							<FileAudio2Icon />
							<p
								className={clsx({
									hidden: !pathname.includes('/dashboard/music'),
									'flex text-center': pathname.includes('/dashboard/music'),
								})}
							>
								Music
							</p>
						</Link>
						<Link
							href='/dashboard/video'
							className={clsx('text-primary flex p-2 rounded-md border-2', {
								'bg-primary rounded-md text-secondary gap-1': pathname.includes('/dashboard/video'),
							})}
						>
							<FileVideoIcon />
							<p
								className={clsx({
									hidden: !pathname.includes('/dashboard/video'),
									'flex text-center': pathname.includes('/dashboard/video'),
								})}
							>
								Video
							</p>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
