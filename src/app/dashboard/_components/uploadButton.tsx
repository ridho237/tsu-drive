'use client';

import { Button } from '@/components/ui/button';
import { useOrganization, useUser } from '@clerk/nextjs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Doc } from '../../../../convex/_generated/dataModel';

const formSchema = z.object({
	title: z.string().min(1).max(200),
	file: z.custom<FileList>((val) => val instanceof FileList, 'Required').refine((files) => files.length > 0),
});

export function UploadButton() {
	const { toast } = useToast();
	const organization = useOrganization();
	const user = useUser();
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			file: undefined,
		},
	});

	const fileRef = form.register('file');
	const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const createFile = useMutation(api.files.createFile);
	const MAX_STORAGE_MB = 1000000;

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

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!orgId) return;
		if ((storageUsedNumber || 0) > MAX_STORAGE_MB) {
			toast({
				variant: 'destructive',
				title: 'Penyimpanan telah penuh',
				description: `Kamu tidak dapat upload file karena penyimpanan sudah penuh maksimal ${MAX_STORAGE_MB} MB.`,
			});
			return;
		}

		const postUrl = await generateUploadUrl();
		const fileType = values.file[0].type;

		const xhr = new XMLHttpRequest();
		xhr.open('POST', postUrl, true);
		xhr.setRequestHeader('Content-Type', fileType);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				const percentComplete = (event.loaded / event.total) * 100;
				setUploadProgress(percentComplete);
			}
		};

		xhr.onload = async () => {
			if (xhr.status === 200) {
				const { storageId } = JSON.parse(xhr.responseText);
				const types = {
					'image/png': 'png',
					'image/jpeg': 'jpeg',
					'video/mp4': 'video',
					'video/mkv': 'video',
					'audio/mp3': 'audio',
					'audio/mpeg': 'audio',
					'application/pdf': 'pdf',
					'text/csv': 'csv',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
					'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'powerpoint',
					'application/zip': 'zip',
					'application/x-compressed': 'rar',
				} as Record<string, Doc<'files'>['type']>;
				try {
					await createFile({
						name: values.title,
						fileId: storageId,
						orgId,
						type: types[fileType],
						size: values.file[0].size,
					});
					form.reset();
					setIsFileDialogOpen(false);
					setUploadProgress(0);
					toast({
						variant: 'default',
						title: 'File Terupload',
						description: 'Yeay File kamu berhasil terupload!!',
					});
				} catch (err) {
					toast({
						variant: 'destructive',
						title: 'Ada yang tidak beres',
						description: 'File kamu tidak diupload, Coba lagi nanti',
					});
				}
			} else {
				toast({
					variant: 'destructive',
					title: 'Ada yang tidak beres',
					description: 'File kamu tidak diupload, Coba lagi nanti',
				});
			}
		};

		xhr.send(values.file[0]);
	}

	return (
		<Dialog
			open={isFileDialogOpen}
			onOpenChange={(isOpen) => {
				setIsFileDialogOpen(isOpen);
				form.reset();
				setUploadProgress(0);
			}}
		>
			<DialogTrigger asChild>
				<Button className='py-5 text-primary bg-primary-foreground border-2 hover:text-primary-foreground'>
					<p className='text-[17px]'>Upload File</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='mb-8'>Upload file kamu disini</DialogTitle>
					<DialogDescription>File ini dapat diakses untuk siapapun diorganisasimu</DialogDescription>
				</DialogHeader>
				<div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'
						>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Judul File</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='file'
								render={() => (
									<FormItem>
										<FormLabel>File</FormLabel>
										<FormControl>
											<Input
												type='file'
												accept='image/*,video/*,audio/*,.pdf,.csv,.docx,.xlsx,.pptx,.zip,.rar'
												{...fileRef}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{uploadProgress > 0 && (
								<div className='relative pt-1'>
									<div className='flex mb-2 items-center justify-between'>
										<div className='text-right'>
											<span className='text-xs font-semibold inline-block text-blue-600'>{Math.round(uploadProgress)}%</span>
										</div>
									</div>
									<div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200'>
										<div
											style={{ width: `${uploadProgress}%` }}
											className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600'
										></div>
									</div>
								</div>
							)}
							<Button
								type='submit'
								disabled={form.formState.isSubmitting}
								className='flex gap-1 text-primary bg-primary-foreground shadow-lg hover:text-primary-foreground'
							>
								{form.formState.isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
								Upload
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
