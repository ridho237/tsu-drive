import { Button } from '@/components/ui/button';
import { Archive, Building2, FilePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from './footer';

export default function Home() {
	return (
		<main>
			<div className='flex flex-col justify-center items-center h-[800px] sm:h-screen bg-hero-image bg-contain'>
				<Image
					src='/logo.png'
					width='180'
					height='180'
					alt='logo tsu drive'
				></Image>
				<h1 className='w-[250px] sm:w-[450px] text-xl font-bold sm:text-3xl text-primary text-center'>
					Upload, Share, and Downloads in One Place.
				</h1>
				<Button className='mt-10 p-5'>
					<Link href='/dashboard/allFiles'>Get Started</Link>
				</Button>

				<div className='flex flex-col items-center'>
					<h1 className='my-8 text-xl text-primary font-bold'>Our Services</h1>
					<div className='flex flex-col sm:flex-row justify-center items-center gap-10'>
						<div className='flex flex-col  bg-primary items-center text-primary-foreground border-2 rounded-md p-3 w-32'>
							<Archive />
							<p>File Storage</p>
						</div>
						<div className='flex flex-col bg-primary items-center text-primary-foreground border-2 rounded-md p-3'>
							<FilePen />
							<p>Management File</p>
						</div>
						<div className='flex flex-col bg-primary items-center text-primary-foreground border-2 rounded-md p-3 w-32'>
							<Building2 />
							<p>Organization</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
