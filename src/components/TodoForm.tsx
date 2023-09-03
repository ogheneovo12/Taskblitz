import Xclose from '@/assets/icons/x-close.svg'
import React, { useCallback, useState, type ReactElement } from 'react'
import type { CreateTaskPayload, ITask } from 'types'
import { defaultAction } from 'utils'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

interface properties {
	title?: React.ReactNode
	onFormSubmit?: (value: CreateTaskPayload, id?: string) => void
	onClose?: () => void
	actionText?: string
	initialValues: ITask | null
	loading?: boolean
}

function TodoForm({
	title,
	onFormSubmit = defaultAction,
	onClose = defaultAction,
	actionText,
	initialValues,
	loading
}: properties): ReactElement {
	const [todoTitle, setTodoTitle] = useState<string>(initialValues?.title ?? '')
	const [datePicked, setDatePicked] = React.useState<Date>(
		initialValues?.created_at ? new Date(initialValues.created_at) : new Date()
	)
	const [startsAt, setStartsAt] = React.useState<Date>(
		initialValues?.starts_at ? new Date(initialValues.starts_at) : new Date()
	)
	const [endsAt, setEndsAt] = React.useState<Date>(
		initialValues?.ends_at ? new Date(initialValues.ends_at) : new Date()
	)

	const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		onFormSubmit(
			{
				title: todoTitle,
				created_at: datePicked.toISOString(),
				completed: false,
				notify_at: 'before',
				notify_at_value: '10m',
				starts_at: startsAt.toISOString(),
				ends_at: endsAt.toISOString()
			},
			initialValues?.id
		)
	}

	const onTimeFieldStartChange = useCallback((value: Date): void => {
		setStartsAt(value)
	}, [])

	const onTimeFieldEndChange = (value: Date): void => {
		setEndsAt(value)
	}

	const onTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
		setTodoTitle(event.target.value)

	return (
		<form
			onSubmit={onSubmit}
			className=' w-full max-w-[394px] rounded-lg border border-gray-100 p-6 shadow-calendar'
		>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
				<Xclose />
			</div>
			<textarea
				value={todoTitle}
				onChange={onTitleChange}
				className='h-[140px] w-full rounded-lg border border-gray-300 bg-gray-50'
			/>
			<div className='my-4 flex  items-center justify-between'>
				<DatePicker
					value={datePicked}
					onValueChange={(value): void => {
						setDatePicked(value as Date)
					}}
				/>

				<TimePicker
					value={startsAt}
					onChange={onTimeFieldStartChange}
					baseDate={datePicked}
				/>
				<TimePicker
					value={endsAt}
					onChange={onTimeFieldEndChange}
					baseDate={datePicked}
				/>
			</div>
			<div className='flex space-x-3'>
				<button type='button' className='btn btn-ghost ' onClick={onClose}>
					Cancel
				</button>
				<button
					disabled={loading}
					type='submit'
					className='btn btn-primary disabled:opac'
				>
					{loading ? 'submitting...' : actionText}
				</button>
			</div>
		</form>
	)
}

export default TodoForm
