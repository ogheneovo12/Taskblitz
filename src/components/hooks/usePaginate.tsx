import Pagination from 'components/Pagination'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ONE_VALUE } from 'utils'

export interface IPaginateProperties<T> {
	itemsPerPage: number
	data: T[]
	totalItems?: number
	onFetchData?: (page: number) => Promise<T>
	loading?: boolean
}

export function usePaginate<T>(properties: IPaginateProperties<T>): {
	paginateUI: (rangeDisplay?: number) => ReactElement
	currentItems: T[] | null
} {
	const { itemsPerPage, data = [], onFetchData, totalItems } = properties
	const [page, setPage] = useState(ONE_VALUE)
	const [itemOffset, setItemOffset] = useState(0)

	const currentItems = useMemo(() => {
		const endOffset = itemOffset + itemsPerPage
		// console.log({ itemOffset, endOffset })
		return data.slice(itemOffset, endOffset)
	}, [data, itemOffset, itemsPerPage])

	// console.log({ data, currentItems, itemsPerPage, page, itemOffset })

	const handlePageClick = (newPage: number): void => {
		const newOffset =
			((newPage - ONE_VALUE) * itemsPerPage) % (totalItems ?? data.length) // subtract one to account for array index starting with zero

		if (onFetchData) {
			void onFetchData(newPage).then(() => {
				setItemOffset(
					((newPage - ONE_VALUE) * itemsPerPage) % (totalItems ?? data.length)
				)
				setPage(newPage)
			})
		} else {
			setItemOffset(newOffset)
			setPage(newPage)
		}
	}

	const paginateUI = (siblings_count = ONE_VALUE): ReactElement => (
		<Pagination
			totalItems={totalItems ?? data.length}
			itemsPerPage={itemsPerPage}
			currentPage={page}
			onPageChange={(newPage): void => handlePageClick(newPage)}
			siblingCount={siblings_count}
		/>
	)

	useEffect(() => {
		// Reset the page to 1 when either data or totalItems changes
		setPage(ONE_VALUE)
		setItemOffset(0)
	}, [data])

	return { paginateUI, currentItems }
}
