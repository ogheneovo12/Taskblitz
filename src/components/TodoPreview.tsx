import CalendarIcon from '@/assets/icons/calendar.svg'
import ClockIcon from '@/assets/icons/clock.svg'
import Xclose from '@/assets/icons/x-close.svg'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from 'api/todos.api'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import type { ReactElement } from 'react'
import toast from 'react-hot-toast'
import type { ITask } from 'types'
import { defaultAction, getErrorMessage } from 'utils'

dayjs.extend(advancedFormat)

function TodoPreview({
	todo,
	onEdit = defaultAction,
	onClose
}: {
	todo: ITask
	onEdit: () => void
	onClose: () => void
}): ReactElement {
	const queryClient = useQueryClient()

	const { isLoading: isDeletingTask, mutate: onDeleteTask } = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['todos'] })
			onClose()
		},
		onError: addError => {
			toast.error(getErrorMessage(addError) ?? '')
		}
	})

	return (
		<div className=' w-full max-w-[394px] rounded-lg p-6 lg:border lg:border-gray-100 lg:shadow-calendar'>
			<div className='flex justify-end'>
				<button onClick={onClose} type='button'>
					{' '}
					<Xclose />
				</button>
			</div>
			<h2 className='text-lg font-bold text-foundation-grey-normal'>
				{todo.title}
			</h2>
			<div className='my-9'>
				<p className='mb-[9px] flex items-center text-foundation-grey-normal'>
					<span className='mr-2 text-primary'>
						<CalendarIcon />
					</span>{' '}
					{dayjs(todo.created_at).format('Do MMMM, YYYY')}
				</p>
				<p className='flex items-center text-foundation-grey-normal'>
					<span className='mr-2 text-primary'>
						<ClockIcon />
					</span>{' '}
					<span>
						{dayjs(todo.starts_at).format('hh:mm a')} -{' '}
						{dayjs(todo.ends_at).format('hh:mm a')}
					</span>
				</p>
			</div>
			<div className='flex space-x-3'>
				<button
					disabled={isDeletingTask}
					type='button'
					onClick={(): void => onDeleteTask(todo.id)}
					className='btn btn-ghost '
				>
					{isDeletingTask ? 'Deleting..' : '	Delete'}
				</button>
				<button type='button' onClick={onEdit} className='btn btn-primary'>
					Edit
				</button>
			</div>
		</div>
	)
}

TodoPreview.propTypes = {}

export default TodoPreview
