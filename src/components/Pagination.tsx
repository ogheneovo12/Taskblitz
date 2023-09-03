import ArrowLeft from '@/assets/icons/arrow-left.svg'
import ArrowRight from '@/assets/icons/arrow-right.svg'
import cx from 'classnames'
import type { ReactElement } from 'react'

interface PaginationProperties {
	totalItems: number
	itemsPerPage: number
	currentPage: number
	onPageChange: (newPage: number) => void
	pageRangeDisplayed: number
}

const INDEX_START = 1
const INDEX_DIVISOR = 2

function Pagination({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
	pageRangeDisplayed
}: PaginationProperties): ReactElement {
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const handlePageChange = (newPage: number): void => {
		if (newPage >= INDEX_START && newPage <= totalPages) {
			onPageChange(newPage)
		}
	}

	const renderPageNumbers = (): ReactElement[] => {
		const pageNumbers: (number | string)[] = []
		const numberDisplayed = Math.min(totalPages, pageRangeDisplayed)

		if (totalPages <= numberDisplayed) {
			for (let index = INDEX_START; index <= totalPages; index += INDEX_START) {
				pageNumbers.push(index)
			}
		} else {
			const halfRange = Math.floor(pageRangeDisplayed / INDEX_DIVISOR)
			let startPage = currentPage - halfRange
			if (startPage < INDEX_START) {
				startPage = INDEX_START
			}
			let endPage = startPage + pageRangeDisplayed - INDEX_START
			if (endPage > totalPages) {
				endPage = totalPages
				startPage = endPage - pageRangeDisplayed + INDEX_START
			}

			if (startPage > INDEX_START) {
				pageNumbers.push(INDEX_START)
				if (startPage > INDEX_DIVISOR) {
					pageNumbers.push('...')
				}
			}

			for (let index = startPage; index <= endPage; index += INDEX_START) {
				pageNumbers.push(index)
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - INDEX_START) {
					pageNumbers.push('...')
				}
				pageNumbers.push(totalPages)
			}
		}

		return pageNumbers.map(pageNumber => (
			<button
				type='button'
				key={`_page_${pageNumber}`}
				onClick={(): void => {
					if (typeof pageNumber === 'number') {
						handlePageChange(pageNumber)
					}
				}}
				className={cx(
					'flex h-10 w-10 items-center justify-center rounded-[20px] font-medium text-gray-600',
					pageNumber === currentPage ? 'bg-gray-50' : ''
				)}
				disabled={pageNumber === '...'}
			>
				{pageNumber}
			</button>
		))
	}

	return (
		<div className='flex items-center justify-between'>
			<button
				type='button'
				onClick={(): void => handlePageChange(currentPage - INDEX_START)}
				disabled={currentPage === INDEX_START}
				className='flex items-center space-x-2 font-semibold text-gray-600'
			>
				<ArrowLeft /> <span className='hidden sm:inline-block'>Previous</span>
			</button>
			<div className='flex items-center'>{renderPageNumbers()}</div>
			<button
				type='button'
				onClick={(): void => handlePageChange(currentPage + INDEX_START)}
				disabled={currentPage === totalPages}
				className='flex items-center space-x-2 font-semibold text-gray-600'
			>
				<span className='hidden sm:inline-block'>Next</span> <ArrowRight />
			</button>
		</div>
	)
}

export default Pagination
