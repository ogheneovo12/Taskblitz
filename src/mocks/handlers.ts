import { rest } from 'msw'
import todos from './data/todos.json'

const handlers = [
	rest.get(
		'https://64f0cd2e8a8b66ecf77a2324.mockapi.io/api/todos',
		async (_, response, context) => response(context.json(todos))
	)
]

export default handlers
