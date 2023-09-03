import ClockIcon from '@/assets/icons/clock.svg'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, type ReactElement } from 'react'
import TimeField from 'react-simple-timefield'
import { DAY_HOUR_TURN, MAX_MINUTES_COUNT, changeAmPmValue } from 'utils'
import RadixSelect, { SelectItem } from './RadixSelect'

interface properties {
	value: Date
	onChange: (value: Date) => void
	baseDate: Date // date on which the time will be based
	// allowdebug?: boolean
}
function TimePicker({
	value,
	onChange,
	baseDate // allowdebug
}: properties): ReactElement {
	const dayjsValue = useMemo(() => dayjs(value), [value])
	const dayjsBaseDate = useMemo(() => dayjs(baseDate), [baseDate])
	const splitted = dayjsValue.format('hh:mm a').split(' ')

	const onHandleChange = (
		event_: React.ChangeEvent<HTMLInputElement>,
		newValue: string
	): void => {
		const [hours, minutes] = newValue.split(':').map(Number)

		// Validate the hour and minute values
		if (
			hours < 0 ||
			hours > DAY_HOUR_TURN ||
			minutes < 0 ||
			minutes > MAX_MINUTES_COUNT
		) {
			throw new Error('Invalid hour or minute values')
		}

		// Add the specified hours and minutes to the date
		onChange(
			changeAmPmValue(
				dayjsValue.hour(hours).minute(minutes),
				splitted[1]
			).toDate()
		)
	}

	const onAmorPmChange = useCallback(
		(newValue: string): void => {
			onChange(changeAmPmValue(dayjsValue, newValue).toDate())
		},
		[dayjsValue, onChange]
	)

	useEffect(() => {
		if (
			dayjsBaseDate.format('DD/MM/YYYY') !== dayjsValue.format('DD/MM/YYYY')
		) {
			const copied = dayjsValue.clone()
			const previous = copied.format('hh:mm a').split(' ')
			const [hours, minutes] = previous[0].split(':').map(Number)
			const newValue = dayjsBaseDate.hour(hours).minute(minutes)

			// if (allowdebug) {
			// 	console.log(
			// 		'Diff',
			// 		dayjsBaseDate.format('DD/MM/YYYY hh:mm a'),
			// 		copied.format('DD/MM/YYYY hh:mm a'),
			// 		newValue.format('DD/MM/YYYY hh:mm a'),
			// 		previous[1]
			// 	)
			// }

			onChange(changeAmPmValue(newValue, previous[1]).toDate())
		}
	}, [baseDate, dayjsBaseDate, dayjsValue, onChange])

	return (
		<div className='btn btn-ghost flex max-w-[115px] items-center space-x-1 px-1 text-sm hover:bg-transparent hover:text-gray-700'>
			<span className='flex-shrink-0 text-gray-500'>
				<ClockIcon />
			</span>

			<TimeField
				input={
					<input className='border-none p-0 text-sm text-gray-500 focus:border-none focus:outline-none focus:ring-0' />
				}
				value={splitted[0]}
				onChange={onHandleChange}
				colon=':'
				style={{
					width: '100%'
				}}
			/>
			<RadixSelect
				defaultValue='am'
				value={splitted[1]}
				onValueChange={onAmorPmChange}
				contentWidth='100px'
				contentClassName='px-2'
				className='flex items-center text-gray-500'
			>
				<SelectItem value='am'>am</SelectItem>
				<SelectItem value='pm'>pm</SelectItem>
			</RadixSelect>
		</div>
	)
}

TimePicker.propTypes = {}

export default TimePicker
