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
	const createFile = useMutation(api.files.createFile);
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
		const result = await fetch(postUrl, {
			method: 'POST',
			headers: { 'Content-Type': fileType },
			body: values.file[0],
		});

		const { storageId } = await result.json();
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
	}

	return (
		<Dialog
			open={isFileDialogOpen}
			onOpenChange={(isOpen) => {
				setIsFileDialogOpen(isOpen);
				form.reset();
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
												accept='image/*,video/*,audio/*,.pdf,.csv,.docx,.xlsx,.pptx'
												{...fileRef}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
