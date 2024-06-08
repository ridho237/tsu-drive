import { FileBrowser } from '../_components/fileBrowser';

export default function DocumentPages() {
	return (
		<main>
			<FileBrowser
				title='Document'
				documentOnly
			/>
		</main>
	);
}
