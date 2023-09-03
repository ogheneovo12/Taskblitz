import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function AppLayout(): ReactElement {
	return (
		<>
			<AppHeader />
			<main>
				<Outlet />
			</main>
		</>
	)
}
