export type FetchBaseQueryError =
	| {
			/**
			 * * `"CUSTOM_ERROR"`:
			 *   A custom error type that you can return from your `queryFn` where another error might not make sense.
			 * */
			status: 'CUSTOM_ERROR'
			data?: unknown
			error: string
	  }
	| {
			/**
			 * * `"FETCH_ERROR"`:
			 *   An error that occurred during execution of `fetch` or the `fetchFn` callback option
			 * */
			status: 'FETCH_ERROR'
			data?: undefined
			error: string
	  }
	| {
			/**
			 * * `"PARSING_ERROR"`:
			 *   An error happened during parsing.
			 *   Most likely a non-JSON-response was returned with the default `responseHandler` "JSON",
			 *   or an error occurred while executing a custom `responseHandler`.
			 * */
			status: 'PARSING_ERROR'
			originalStatus: number
			data: string
			error: string
	  }
	| {
			/**
			 * * `"TIMEOUT_ERROR"`:
			 *   Request timed out
			 * */
			status: 'TIMEOUT_ERROR'
			data?: undefined
			error: string
	  }
	| {
			/**
			 * * `number`:
			 *   HTTP status code
			 */
			status: number
			data: unknown
	  }
