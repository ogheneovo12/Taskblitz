import CalendarIcon from '@/assets/icons/calendar.svg'
import * as Popover from '@radix-ui/react-popover'
import cx from 'classnames'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import { useEffect, useMemo, useState, type ReactElement } from 'react'
import Calendar from 'react-calendar'
import { ONE_VALUE, getDayOfWeek } from 'utils'

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const onOpenAutoFocus = (event: Event): void => {
	event.preventDefault()
}

type DateValue = Date | null

function DatePicker({
	value,
	onValueChange,
	className,
	contentClassName
}: {
	value: DateValue
	onValueChange: (value: DateValue) => void
	className?: string
	contentClassName?: string
}): ReactElement {
	const [showCustom, setShowCustom] = useState(false)
	const dayJsValue = useMemo(() => dayjs(value), [value])

	useEffect(() => {
		if (!dayJsValue.isToday() && !dayJsValue.isTomorrow()) {
			setShowCustom(true)
		}
	}, [dayJsValue])

	const valueDisplay = useMemo(() => {
		if (dayJsValue.isToday()) return 'Today'
		if (dayJsValue.isTomorrow()) return 'Tomorrow'
		return dayJsValue.format('DD/MM/YYYY')
	}, [dayJsValue])

	return (
		<Popover.Root>
			<Popover.Trigger
				className={cx(
					'anchor_elem btn  btn-ghost  max-w-[100px] space-x-2 text-gray-500',
					className
				)}
			>
				<CalendarIcon />
				<span>{valueDisplay}</span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					onOpenAutoFocus={onOpenAutoFocus}
					className={cx(
						'radix-popover-content  z-50 w-screen   rounded-[8px]',
						showCustom ? 'max-w-[400px]' : 'max-w-[300px]',
						contentClassName
					)}
				>
					{showCustom ? (
						<>
							<Calendar
								onChange={(newValue): void =>
									onValueChange(newValue as DateValue)
								}
								showNeighboringMonth={false}
								className=' ml-auto !w-full !max-w-[394px] rounded-lg !border-gray-100 px-6 py-5 !font-sans'
							/>
							<button
								onClick={(): void => setShowCustom(false)}
								type='button'
								className='btn btn-ghost mt-2 max-w-full'
							>
								Cancel
							</button>
						</>
					) : (
						<div className='divide-y divide-gray-300'>
							<button
								onClick={(): void => onValueChange(new Date())}
								className=' flex w-full cursor-pointer justify-between px-2 py-4 text-base hover:bg-black hover:bg-opacity-5 '
								type='button'
							>
								<span className='flex items-center space-x-4'>
									<CalendarIcon /> <span>Today</span>
								</span>{' '}
								{getDayOfWeek(new Date())}
							</button>
							<button
								onClick={(): void =>
									onValueChange(dayjs().add(ONE_VALUE, 'day').toDate())
								}
								className='flex w-full cursor-pointer justify-between px-2 py-4 text-base hover:bg-black hover:bg-opacity-5'
								type='button'
							>
								<span className='flex items-center space-x-4'>
									<CalendarIcon /> <span>Tomorrow</span>
								</span>{' '}
								{getDayOfWeek(dayjs().add(ONE_VALUE, 'day').toDate())}
							</button>
							<button
								onClick={(): void => setShowCustom(true)}
								className='flex w-full cursor-pointer justify-between px-2 py-4 text-base hover:bg-black hover:bg-opacity-5'
								type='button'
							>
								<span className='flex items-center space-x-4'>
									<CalendarIcon /> <span>Pick a date</span>
								</span>{' '}
							</button>
						</div>
					)}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}

DatePicker.propTypes = {}

export default DatePicker
