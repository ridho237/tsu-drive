import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	query: z.string().min(0).max(200),
});

export function SearchBar({
	query,
	setQuery,
}: {
	readonly query: string;
	readonly setQuery: Dispatch<SetStateAction<string>>;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			query,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setQuery(values.query);
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex gap-2 items-center'
				>
					<FormField
						control={form.control}
						name='query'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										placeholder='Input nama filemu'
										className='text-primary'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						variant={'outline'}
						size='icon'
						type='submit'
						disabled={form.formState.isSubmitting}
						className='flex h-9 w-9 bg-primary text-primary-foreground hover:text-primary'
					>
						{form.formState.isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
						<SearchIcon />
					</Button>
				</form>
			</Form>
		</div>
	);
}
