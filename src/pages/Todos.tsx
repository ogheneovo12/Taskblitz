import PlusIcon from '@/assets/icons/plus.svg'
import '@/styles/calendar.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addTask, getTasks, updateTask } from 'api/todos.api'
import IsEmpty from 'components/IsEmpty'
import LoadingOrError from 'components/LoadingOrError'
import TodoForm from 'components/TodoForm'
import TodoItem from 'components/TodoItem'
import TodoPreview from 'components/TodoPreview'
import { usePaginate } from 'components/hooks/usePaginate'
import { useMemo, useState, type ReactElement } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { toast } from 'react-hot-toast'
import type { ITask } from 'types'
import {
	DEFAULT_PAGE_RANGE_DISPLAY,
	HALF,
	getErrorMessage,
	useMediaQuery
} from 'utils'
import DateList from '../components/DateListScroll'

const LIMIT = 10

export default function TodosPage(): ReactElement {
	const [panelView, setPanelView] = useState<string>('default')
	const limit = useMemo(() => LIMIT, [])
	const [filterOptions, setFilterOptions] = useState<
		Record<string, number | string | null | undefined>
	>({
		created_at: null,
		completed: null,
		sortBy: 'created_at',
		order: 'desc'
	})
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null)
	const queryClient = useQueryClient()
	const isDesktopOrBigger = useMediaQuery(`(min-width:1024px)`)

	const {
		isLoading,
		isError,
		error,
		data = []
	} = useQuery(
		['todos', filterOptions],
		async (): Promise<ITask[]> =>
			getTasks({
				// page,
				// limit,
				...filterOptions
			})
	)

	const { isLoading: isAddingTask, mutate: addNewTask } = useMutation({
		mutationFn: addTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['todos']
			})
		},
		onError: addError => {
			toast.error(getErrorMessage(addError) ?? '')
		}
	})

	const { isLoading: isUpdatingTask, mutate: editTask } = useMutation({
		mutationFn: updateTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: addError => {
			toast.error(getErrorMessage(addError) ?? '')
		}
	})

	// OPTED OUT FROM SERVER SIDE PAGINATION, as getting total counts from the mock server is a paid feature
	const { paginateUI, currentItems } = usePaginate<ITask>({
		data,
		itemsPerPage: limit,
		totalItems: data.length,
		onFetchData: undefined
	})

	const onAddTask = (): void => {
		setPanelView('addTodo')
	}

	const onEditTask = (): void => {
		if (selectedTask) {
			setPanelView('editTodo')
		}
	}

	const onCloseTaskForm = (): void => {
		if (selectedTask) setSelectedTask(null)
		setPanelView('default')
	}

	const onClosePreview = (): void => {
		if (selectedTask) setSelectedTask(null)
		setPanelView('default')
	}
	const panelOptions: Record<string, React.ReactNode> = {
		default: (
			<Calendar
				value={
					filterOptions.created_at ? new Date(filterOptions.created_at) : null
				}
				className='!w-full !max-w-[394px] rounded-lg !border-gray-100 px-6 py-5 !font-sans shadow-calendar'
				prev2AriaLabel={undefined}
				next2AriaLabel={' '}
				showNeighboringMonth={false}
				onChange={(date): void => {
					const newDate = (date as Date).toISOString()
					setFilterOptions(previous => ({
						...previous,
						created_at: newDate === previous.created_at ? null : newDate // account for unselection
					}))
				}}
			/>
		),
		addTodo: (
			<TodoForm
				title='Add Todo'
				actionText='Add Task'
				onClose={onCloseTaskForm}
				initialValues={null}
				onFormSubmit={(value): void => {
					addNewTask(value)
				}}
				loading={isAddingTask}
			/>
		),
		editTodo: selectedTask ? (
			<TodoForm
				title='Edit Task'
				actionText='Save'
				onClose={onCloseTaskForm}
				initialValues={selectedTask}
				onFormSubmit={(value): void => {
					editTask({ ...value, id: selectedTask.id })
				}}
				loading={isUpdatingTask}
			/>
		) : null,
		previewTask: selectedTask ? (
			<TodoPreview
				todo={selectedTask}
				onEdit={onEditTask}
				onClose={onClosePreview}
			/>
		) : null
	}

	const filterApplied = filterOptions.created_at ?? filterOptions.completed

	return (
		<section className='section'>
			<div className=' container'>
				<div className='mb-8 flex items-center  justify-between'>
					<hgroup>
						<h2 className=' text-3xl font-semibold text-gray-900'>
							Good morning!
						</h2>
						<p className='text-base text-gray-600'>You got some task to do. </p>
					</hgroup>
					<button
						onClick={onAddTask}
						type='button'
						className='btn btn-primary hidden space-x-1 sm:flex'
					>
						<PlusIcon /> <span>Create New Task</span>
					</button>
				</div>
				<div className='flex divide-x-2'>
					<div className='w-full  lg:w-[70%] lg:max-w-[826px] lg:px-0 lg:pr-4'>
						<div className='mb-8 '>
							<DateList
								onItemClick={(date): void => {
									const newDate = date.toISOString()
									setFilterOptions(previous => ({
										...previous,
										created_at: newDate === previous.created_at ? null : newDate // account for unselection
									}))
								}}
								startDate={
									filterOptions.created_at
										? new Date(filterOptions.created_at)
										: new Date()
								}
							/>
						</div>
						<h2 className='mb-4 text-base font-semibold text-gray-900'>
							My Task
						</h2>
						<div className='space-y-4'>
							{isLoading || isError ? (
								<LoadingOrError
									error={error as Error}
									className='!min-h-[200px]'
								/>
							) : (
								currentItems?.map((task: ITask, index: number) => (
									<TodoItem
										key={task.id}
										todo={task}
										index={index}
										onClick={(): void => {
											setSelectedTask(task)
											setPanelView('previewTask')
										}}
										isActive={task.id === selectedTask?.id}
									/>
								))
							)}
							{!currentItems?.length && (
								<IsEmpty
									title={
										filterApplied
											? 'No Records Found'
											: 'No records has been added yet.'
									}
									description={
										filterApplied
											? 'there are no records that matches your query'
											: 'Add a new record by simpley clicking the button on top right side.'
									}
								/>
							)}

							{paginateUI(
								isDesktopOrBigger ? DEFAULT_PAGE_RANGE_DISPLAY : HALF
							)}
						</div>
					</div>
					{isDesktopOrBigger ? (
						<div className='flex-shrik-0  hidden flex-grow flex-col items-center lg:flex lg:pl-5'>
							{panelOptions[panelView]}
						</div>
					) : null}
				</div>
			</div>
		</section>
	)
}
