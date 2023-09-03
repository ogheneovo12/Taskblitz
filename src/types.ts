export interface ITask {
	title: string
	completed: boolean
	created_at: string
	notify_at: string
	notify_at_value: string
	starts_at: string
	ends_at: string
	id: string
}

export type CreateTaskPayload = Omit<ITask, 'id'>
