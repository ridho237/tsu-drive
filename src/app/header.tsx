'use client';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton, SignUpButton, OrganizationSwitcher } from '@clerk/nextjs';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleEllipsis, PanelsRightBottomIcon } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

export function Header() {
	return (
		<main>
			<div className='flex flex-row justify-between items-center p-4 border-b-2'>
				<Link
					href='/'
					className='flex items-center'
				>
					<Image
						src='/logo.png'
						width='80'
						height='80'
						alt='logo-tsu-drive'
					></Image>
					<h1 className='text-2xl font-extrabold text-primary'>TsuDrive</h1>
				</Link>

				<div className='hidden sm:flex items-center gap-5'>
					<SignedIn>
						<Button className='text-primary bg-primary-foreground border-2 hover:text-primary-foreground'>
							<Link href='/dashboard/allFiles'>Dashboard</Link>
						</Button>
						<OrganizationSwitcher
							appearance={{
								elements: {
									avatarBox: 'h-[38px] w-[38px]',
									userPreview: 'text-primary',
									organizationPreview: 'text-primary',
									organizationSwitcherTrigger: 'text-primary',
									userButtonPopoverCard: { pointerEvents: 'initial' },
								},
							}}
						/>
					</SignedIn>
					<SignedIn>
						<UserButton
							appearance={{
								elements: {
									avatarBox: 'h-[38px] w-[38px] border-2 border-primary',
									userPreview: 'text-primary',
									organizationPreview: 'text-primary',
									userButtonPopoverCard: { pointerEvents: 'initial' },
								},
							}}
						></UserButton>
					</SignedIn>
					<SignedOut>
						<SignUpButton>
							<Button>Sign Up</Button>
						</SignUpButton>
						<SignInButton>
							<Button>Sign In</Button>
						</SignInButton>
					</SignedOut>
				</div>

				<div className='flex items-center sm:hidden mr-4'>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<CircleEllipsis className='h-[38px] w-[38px] text-primary' />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<SignedIn>
									<div className='flex w-full justify-around items-center'>
										<UserButton
											appearance={{
												elements: {
													avatarBox: 'h-[38px] w-[38px] border-4 border-primary',
													userButtonPopoverCard: { pointerEvents: 'initial' },
												},
											}}
										></UserButton>
										<p>User Profile</p>
									</div>
								</SignedIn>
								<SignedOut>
									<div className='flex w-full justify-around items-center'>
										<SignUpButton>Sign Up</SignUpButton>
									</div>
								</SignedOut>
							</DropdownMenuItem>
							<DropdownMenuItem className='justify-center gap-8'>
								<SignedIn>
									<div className='flex w-full justify-around items-center'>
										<PanelsRightBottomIcon className='bg-primary text-primary-foreground h-[38px] w-[38px] border-4 border-primary rounded-sm' />
										<Link href='/dashboard/allFiles'>Dashboard</Link>
									</div>
								</SignedIn>
								<SignedOut>
									<Link href='/dashboard/allFiles'>Dashboard</Link>
								</SignedOut>
							</DropdownMenuItem>
							<DropdownMenuItem className='justify-center'>
								<SignedIn>
									<OrganizationSwitcher
										appearance={{
											elements: {
												organizationSwitcherTrigger: 'h-[32px] w-[140px]',
												avatarBox: 'h-[35px] w-[35px] border-4 border-primary',
												organizationSwitcherPopoverCard: { pointerEvents: 'initial' },
											},
										}}
									/>
								</SignedIn>
								<SignedOut>
									<SignInButton>Sign In</SignInButton>
								</SignedOut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</main>
	);
}
