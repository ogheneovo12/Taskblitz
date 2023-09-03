import type { CreateTaskPayload, ITask } from 'types'
import { filterByDay, objectToQueryString } from 'utils'

// eslint-disable-next-line @typescript-eslint/naming-convention
const postHeaders = { 'content-type': 'application/json' }

const SERVER_ERROR = 500
const NOT_FOUND = 404

export function handleResponseError(response: Response): void {
	if (!response.ok) {
		// Handle the error based on the status code
		if (response.status === NOT_FOUND) {
			// Handle a "Not Found" error
			throw new Error('Resource not found')
		} else if (response.status === SERVER_ERROR) {
			// Handle a "Internal Server Error" error
			throw new Error('Internal Server Error')
		} else {
			// Handle other HTTP error codes
			throw new Error(`HTTP Error: ${response.status}`)
		}
	}
}
export async function getTasks({
	created_at,
	...rest
}: Record<string, number | string | null | undefined>): Promise<ITask[]> {
	const response = await fetch(
		`https://64f0cd2e8a8b66ecf77a2324.mockapi.io/api/todos?${objectToQueryString(
			rest
		)}`
	)

	const data = (await response.json()) as ITask[]
	// mockapi can't filter dates, so handle date filter manually
	if (created_at) {
		return filterByDay<ITask>(
			data,
			created_at as string,
			item => item.created_at
		)
	}

	return data
}

export async function addTask(newTodo: CreateTaskPayload): Promise<ITask> {
	const response = await fetch(
		'https://64f0cd2e8a8b66ecf77a2324.mockapi.io/api/todos',
		{
			method: 'POST',
			headers: postHeaders,
			body: JSON.stringify(newTodo)
		}
	)

	handleResponseError(response)
	return response.json() as Promise<ITask>
}

export async function updateTask({
	id,
	...updatedTask
}: Partial<ITask>): Promise<ITask> {
	const response = await fetch(
		`https://64f0cd2e8a8b66ecf77a2324.mockapi.io/api/todos/${id}`,
		{
			method: 'PUT',
			headers: postHeaders,
			body: JSON.stringify(updatedTask)
		}
	)
	handleResponseError(response)

	return response.json() as Promise<ITask>
}

export async function deleteTask(id: string): Promise<ITask> {
	const response = await fetch(
		`https://64f0cd2e8a8b66ecf77a2324.mockapi.io/api/todos/${id}`,
		{
			method: 'DELETE',
			headers: postHeaders
		}
	)
	handleResponseError(response)
	return response.json() as Promise<ITask>
}
