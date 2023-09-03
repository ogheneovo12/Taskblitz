import * as ScrollArea from '@radix-ui/react-scroll-area'
import cx from 'classnames'
import dayjs from 'dayjs'
import {
	forwardRef,
	useEffect,
	useMemo,
	useRef,
	type ReactElement
} from 'react'
import {
	ONE_VALUE,
	getDayOfWeek,
	getLastDayOfMonth,
	getMonthAndYearFromDate
} from 'utils'

const DateListItem = forwardRef<
	HTMLDivElement,
	{ date: Date; isSelected?: boolean; onClick?: () => void; tabIndex?: number }
>(({ date, isSelected = false, onClick, tabIndex }, reference) => (
	<div
		role='button'
		onClick={onClick}
		onKeyDown={onClick}
		tabIndex={tabIndex}
		ref={reference}
		className={cx(
			'flex h-[68px] w-[62px] flex-col items-center justify-center  rounded-lg border border-gray-300 text-sm font-semibold',
			isSelected ? 'bg-primary text-white' : 'bg-white text-gray-700'
		)}
	>
		<span>{date.getDate()}</span>
		<span>{getDayOfWeek(date)}</span>
	</div>
))

export function DateListScroll({
	startDate,
	onItemClick
}: {
	startDate: Date
	onItemClick?: (value: Date) => void
}): ReactElement {
	const lastDayOfMonth = useMemo(
		() => getLastDayOfMonth(new Date(startDate)),
		[startDate]
	)

	const selectedDateReference = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (selectedDateReference.current) {
			selectedDateReference.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [startDate])

	return (
		<>
			<h4 className='mb-4 text-base font-semibold text-gray-900'>
				{getMonthAndYearFromDate(startDate)}
			</h4>
			<ScrollArea.Root className=' min-h-[100px] w-full overflow-hidden bg-white'>
				<ScrollArea.Viewport className='horizontal-scroll h-full  w-full'>
					<div className='flex items-center space-x-4'>
						{[...Array.from({ length: lastDayOfMonth }).keys()].map(day => {
							const date = dayjs(
								new Date(
									startDate.getFullYear(),
									startDate.getMonth(),
									day + ONE_VALUE
								)
							)
							const isSelected =
								dayjs(startDate).format('DD/MM/YYYY') ===
								date.format('DD/MM/YYYY')

							return (
								<DateListItem
									key={`${startDate.toISOString()}_${day}`}
									date={date.toDate()}
									isSelected={isSelected}
									ref={isSelected ? selectedDateReference : null}
									onClick={(): void => {
										if (onItemClick) {
											onItemClick(date.toDate())
										}
									}}
								/>
							)
						})}
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className='flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col'
					orientation='horizontal'
				>
					<ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-transparent before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] md:bg-primary" />
				</ScrollArea.Scrollbar>
			</ScrollArea.Root>
		</>
	)
}

export default DateListScroll
