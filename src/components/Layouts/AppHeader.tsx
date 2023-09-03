import LogoMark from '@/assets/icons/Logomark.svg'
import Bell from '@/assets/icons/bell.svg'
import Settings from '@/assets/icons/settings.svg'
import Avatar from 'components/Avatar'
import type { ReactElement } from 'react'

function AppHeader(): ReactElement {
	return (
		<div className='dark:bg-nav-dark border-b border-b-gray-200 bg-white'>
			<nav className='dark:bg-nav-dark container mx-auto flex items-center justify-between bg-white py-4 dark:border-gray-700'>
				<div className='flex items-center'>
					<p className='flex items-center space-x-2 text-2xl font-bold text-black'>
						<LogoMark /> <span>Todo</span>
					</p>
				</div>
				<div className='flex items-center space-x-4'>
					<Settings />
					<Bell />
					<Avatar
						src='https://i.pravatar.cc/300'
						alt='User Profile Photo'
						text='AS'
					/>
				</div>
			</nav>
		</div>
	)
}

export default AppHeader
