import { FileBrowser } from '../_components/fileBrowser';

export default function FavoritePages() {
	return (
		<main>
			<FileBrowser
				title='Favorites'
				favoritesOnly
			/>
		</main>
	);
}
