'use client';
import { FileBrowser } from '../_components/fileBrowser';

export default function TrashPages() {
	return (
		<main>
			<FileBrowser
				title='Sampah'
				deletedOnly
			/>
		</main>
	);
}
