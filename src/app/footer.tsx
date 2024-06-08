import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

import Link from 'next/link';

export default function Footer() {
	return (
		<div className='flex flex-col sm:justify-between justify-center sm:flex-row items-center text-center mt-10 mb-10 px-10 gap-4'>
			<div className='text-primary'>© 2024 Made with Shadcn Ui by Muhammad Ridho</div>
			<div className='flex flex-row justify-center gap-2'>
				<div className='p-1 border-2 text-primary-foreground rounded-md bg-primary'>
					<Link href='https://www.instagram.com/mridh00o/'>
						<InstagramLogoIcon className='w-7 h-7'></InstagramLogoIcon>
					</Link>
				</div>
				<div className='p-1 border-2 text-primary-foreground rounded-md bg-primary'>
					<Link href='https://github.com/ridho237'>
						<GitHubLogoIcon className='w-7 h-7'></GitHubLogoIcon>
					</Link>
				</div>
				<div className='p-1 border-2 text-primary-foreground rounded-md bg-primary'>
					<Link href='https://www.linkedin.com/in/muhammad-ridho-545782195/'>
						<LinkedInLogoIcon className='w-7 h-7'></LinkedInLogoIcon>
					</Link>
				</div>
				<div className='p-1 border-2 text-primary-foreground rounded-md bg-primary'>
					<Link href='https://twitter.com/Ridhoxyz_'>
						<TwitterLogoIcon className='w-7 h-7'></TwitterLogoIcon>
					</Link>
				</div>
			</div>
		</div>
	);
}
