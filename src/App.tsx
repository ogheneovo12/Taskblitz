import AppLayout from 'components/Layouts/AppLayout'
import LoadingOrError from 'components/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Todos = lazy(async () => import('pages/Todos'))

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path='/' element={<Todos />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
