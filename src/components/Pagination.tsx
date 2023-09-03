import ArrowLeft from '@/assets/icons/arrow-left.svg'
import ArrowRight from '@/assets/icons/arrow-right.svg'
import cx from 'classnames'
import { useMemo, type ReactElement } from 'react'
import { ONE_VALUE, getRange } from 'utils'

interface PaginationProperties {
	totalItems: number
	itemsPerPage: number
	currentPage: number
	onPageChange: (newPage: number) => void
	siblingCount?: number
}

const INDEX_START = 1
const INDEX_DIVISOR = 2
const TWICE_D = 5
const THREE = 3
const ELLIPSES = '...'

function Pagination({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
	siblingCount = ONE_VALUE
}: PaginationProperties): ReactElement {
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const handlePageChange = (newPage: number): void => {
		if (newPage >= INDEX_START && newPage <= totalPages) {
			onPageChange(newPage)
		}
	}

	const pageNumbers: (number | string)[] = useMemo(() => {
		const totalPageNumbers = siblingCount + TWICE_D

		/* If the page count is lower than the desired page numbers to be displayed, 
		we provide a range spanning from page 1 to the total page count. */
		if (totalPageNumbers >= totalPages) {
			return getRange(ONE_VALUE, totalPages)
		}

		/*
    Ensure the sibilings on either side are  within range 1 and totalPageCount
    */
		const leftSiblingIndex = Math.max(currentPage - siblingCount, ONE_VALUE)
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

		const shouldShowLeftEllipses = leftSiblingIndex > INDEX_DIVISOR
		const shouldShowRightEllipses =
			rightSiblingIndex < totalPages - INDEX_DIVISOR

		const firstPageIndex = 1
		const lastPageIndex = totalPages

		// There are no ellipses on the left, but we should display ellipses on the right.
		if (!shouldShowLeftEllipses && shouldShowRightEllipses) {
			const leftItemCount = THREE + TWICE_D * siblingCount
			const leftRange = getRange(ONE_VALUE, leftItemCount)
			return [...leftRange, ELLIPSES, totalPages]
		}

		// We don't need to display ellipses on the right, but we should show ellipses on the left.
		if (shouldShowLeftEllipses && !shouldShowRightEllipses) {
			const rightItemCount = THREE + INDEX_DIVISOR * siblingCount
			const rightRange = getRange(
				totalPages - rightItemCount + ONE_VALUE,
				totalPages
			)
			return [firstPageIndex, ELLIPSES, ...rightRange]
		}

		// Both ellipses on the left and right should be displayed.
		if (shouldShowLeftEllipses && shouldShowRightEllipses) {
			const middleRange = getRange(leftSiblingIndex, rightSiblingIndex)
			return [firstPageIndex, ELLIPSES, ...middleRange, ELLIPSES, lastPageIndex]
		}
		return []
	}, [currentPage, siblingCount, totalPages])

	const renderPageNumbers = (): ReactElement[] =>
		pageNumbers.map((pageNumber, index) => (
			<button
				type='button'
				// eslint-disable-next-line react/no-array-index-key
				key={`_page_${pageNumber}_${index}`}
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
