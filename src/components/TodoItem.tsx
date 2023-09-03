import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from 'api/todos.api'
import cx from 'classnames'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import type { ReactElement } from 'react'
import toast from 'react-hot-toast'
import type { ITask } from 'types'
import { defaultAction, getErrorMessage } from 'utils'
import Spinner from './Spinner'

dayjs.extend(calendar)

interface Properties {
	todo: ITask
	onClick?: () => void
	index?: number
	isActive?: boolean
}

export default function TodoItem({
	todo,
	onClick = defaultAction,
	index,
	isActive
}: Properties): ReactElement {
	const { title, created_at, starts_at, ends_at, completed, id } = todo
	const queryClient = useQueryClient()

	const { isLoading, mutateAsync } = useMutation({
		mutationFn: updateTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: error => {
			toast.error(getErrorMessage(error) ?? '')
		}
	})

	const onHandleUpdate = async (): Promise<void> => {
		try {
			await mutateAsync({ completed: !completed, id })
		} catch {
			/* empty */
		}
	}

	const humanizedDate = dayjs(created_at).calendar().split(' ')

	return (
		<div
			onClick={onClick}
			onKeyDown={onClick} // accessibility support
			className={cx(
				'flex items-center justify-between border-b border-b-gray-200  px-6 py-4',
				isActive ? 'bg-active ' : 'bg-gray-50',
				isLoading ? 'animate-pulse' : ''
			)}
			role='button'
			tabIndex={index}
		>
			<div className='flex items-center'>
				{isLoading ? (
					<Spinner />
				) : (
					<input
						checked={completed}
						onChange={onHandleUpdate}
						type='checkbox'
						className='mr-3'
					/>
				)}
				<div>
					<h3
						className={cx(
							'text-sm font-semibold ',
							completed ? 'text-inactive' : 'text-gray-900'
						)}
					>
						{title}
					</h3>
					<p
						className={cx(
							'text-sm text-gray-600',
							completed ? 'text-inactive' : 'text-gray-600'
						)}
					>
						{dayjs(starts_at).format('hh:mm a')} -{' '}
						{dayjs(ends_at).format('hh:mm a')}
					</p>
				</div>
			</div>
			<div>
				<p className='text-sm text-gray-900'>
					<span>{humanizedDate[0] ?? ''}</span>
					{'  '}
					<span className='hidden sm:inline-block'>
						{humanizedDate[1] ?? ''} {humanizedDate[2] ?? ''}
					</span>
				</p>
			</div>
		</div>
	)
}
