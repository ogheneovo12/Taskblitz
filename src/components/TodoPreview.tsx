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
		<div className=' w-full max-w-[394px] rounded-lg border border-gray-100 p-6 shadow-calendar'>
			<div className='flex justify-end'>
				<button type='button'>
					{' '}
					<Xclose />
				</button>
			</div>
			<h2 className='text-foundation-grey-normal text-lg font-bold'>
				{todo.title}
			</h2>
			<div className='my-9'>
				<p className='text-foundation-grey-normal mb-[9px] flex items-center'>
					<span className='mr-2 text-primary'>
						<CalendarIcon />
					</span>{' '}
					{dayjs(todo.created_at).format('Do MMMM, YYYY')}
				</p>
				<p className='text-foundation-grey-normal flex items-center'>
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
