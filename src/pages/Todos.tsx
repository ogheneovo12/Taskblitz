import MicrophoneIcon from '@/assets/icons/microphone.svg'
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
import BottomDrawer from 'react-bottom-drawer'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { toast } from 'react-hot-toast'
import type { ITask } from 'types'
import { ONE_VALUE, getErrorMessage, useMediaQuery } from 'utils'
import DateList from '../components/DateListScroll'

const DESKTOP_LIMIT = 10
const MOBILE_LIMIT = 25

export default function TodosPage(): ReactElement {
	const [panelView, setPanelView] = useState<string>('default')

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
	const limit = useMemo(
		() => (isDesktopOrBigger ? DESKTOP_LIMIT : MOBILE_LIMIT),
		[isDesktopOrBigger]
	)
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

	const onCloseTaskForm = (): void => {
		if (selectedTask) setSelectedTask(null)
		setPanelView('default')
	}

	const { isLoading: isAddingTask, mutate: addNewTask } = useMutation({
		mutationFn: addTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['todos']
			})
			onCloseTaskForm()
		},
		onError: addError => {
			toast.error(getErrorMessage(addError) ?? '')
		}
	})

	const { isLoading: isUpdatingTask, mutate: editTask } = useMutation({
		mutationFn: updateTask,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['todos'] })
			onCloseTaskForm()
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

	const onClosePreview = (): void => {
		if (selectedTask) setSelectedTask(null)
		setPanelView('default')
	}

	const calendar = (
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
	)
	const panelOptions: Record<string, React.ReactNode> = {
		default: calendar,
		mobile_calendar: calendar,
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
		<section className='section pb-32 md:pb-0'>
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
								showEditButton={!isDesktopOrBigger}
								onEditButtonClick={(): void => setPanelView('mobile_calendar')}
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
							{/* Render only when item is empty and hide if it's loading or there's error */}
							{!currentItems?.length && !(isError || isLoading) ? (
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
							) : null}

							{paginateUI(isDesktopOrBigger ? ONE_VALUE : 0)}
						</div>
					</div>
					{isDesktopOrBigger ? (
						<div className='flex-shrik-0  hidden flex-grow flex-col items-center lg:flex lg:pl-5'>
							{panelOptions[panelView]}
						</div>
					) : (
						<BottomDrawer
							isVisible={panelView !== 'default'} // default is calendar and shouldn't be shown on mobile
							onClose={(): void => {
								// prevent closing of form if active request while opend
								if (!isAddingTask || !isUpdatingTask) {
									setPanelView('default')
								}
							}}
						>
							{panelOptions[panelView]}
						</BottomDrawer>
					)}
				</div>
			</div>
			<div className='container fixed bottom-0 bg-white py-5 lg:hidden'>
				<button
					onClick={(): void => setPanelView('addTodo')}
					type='button'
					className='flex h-[48px] w-full items-center justify-between rounded-lg border border-gray-300 bg-[#F9FAFB] p-3 shadow-btn'
				>
					<span>Input Task</span>
					<MicrophoneIcon />
				</button>
			</div>
		</section>
	)
}
