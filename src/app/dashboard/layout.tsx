import { SideNavbar } from './sideNavbar';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='h-full p-10'>
			<div className='flex flex-col h-full mb-10 sm:flex-row gap-8 justify-between'>
				<SideNavbar />
				<div className='w-full h-full mb-10'>{children}</div>
			</div>
		</main>
	);
}
