/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { FetchBaseQueryError } from 'FetchBaseQueryError'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useLayoutEffect, useState } from 'react'

export const ONE_VALUE = 1 // prevent magic number error
export const HALF = 2
export const DAY_HOUR_TURN = 12 // for a 12 hour system
export const MAX_MINUTES_COUNT = 59 // max minute count
export const DEFAULT_PAGE_RANGE_DISPLAY = 6

// eslint-disable-next-line import/prefer-default-export
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => matchMedia(query).matches)

	useLayoutEffect(() => {
		const mediaQuery = matchMedia(query)

		function onMediaQueryChange(): void {
			setMatches(mediaQuery.matches)
		}

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return (): void => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [query])

	return matches
}

export function getLastDayOfMonth(date: Date): number {
	const year = date.getFullYear()
	const month = date.getMonth() + ONE_VALUE // Months are zero-indexed
	const lastDayOfMonth = new Date(year, month, 0).getDate()
	return lastDayOfMonth
}

export function getDayOfWeek(date: Date): string {
	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
	const dayNumber = date.getDay()

	if (dayNumber >= 0 && dayNumber < daysOfWeek.length) {
		return daysOfWeek[dayNumber]
	}
	throw new Error('Invalid day number')
}

export function getMonthAndYearFromDate(date: Date): string {
	const month = date.toLocaleString('en-US', { month: 'long' })
	const year = date.getFullYear().toString()
	return `${month} ${year}`
}

export const defaultAction = (): void => {}

export function changeAmPmValue(date: Dayjs, newAmPmValue: string): Dayjs {
	// Ensure the provided value is either 'am' or 'pm'
	if (newAmPmValue !== 'am' && newAmPmValue !== 'pm') {
		throw new Error("Invalid 'newAmPmValue' value. It must be 'am' or 'pm'.")
	}

	const hours = date.hour()
	const minutes = date.minute()
	const seconds = date.second()

	// Determine the current AM or PM value based on the hours
	const currentAmPmValue = hours < DAY_HOUR_TURN ? 'am' : 'pm'

	// Calculate the adjustment needed to switch between AM and PM
	const hourAdjustment =
		currentAmPmValue === 'am' && newAmPmValue === 'pm'
			? DAY_HOUR_TURN
			: // eslint-disable-next-line unicorn/no-nested-ternary
			currentAmPmValue === 'pm' && newAmPmValue === 'am'
			? -DAY_HOUR_TURN
			: 0

	// Create a new Day.js date with the adjusted time
	return date
		.set('hour', hours + hourAdjustment)
		.set('minute', minutes)
		.set('second', seconds)
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
	return typeof error === 'object' && error != null && 'status' in error
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMessage = (message: any): string | undefined => {
	if (typeof message === 'string') return message
	if (typeof message === 'object')
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		return message?.message || 'Oops an Error Occured'

	return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string | undefined =>
	isFetchBaseQueryError(error)
		? getMessage(error.data || error)
		: getMessage(error)

export function objectToQueryString(
	data: Record<string, number | string | null | undefined> = {}
): string {
	const queryParameters = []

	for (const key of Object.keys(data)) {
		if (data[key] !== null && data[key] !== undefined) {
			// Ensure values are properly encoded
			const value = encodeURIComponent(data[key]?.toString() ?? '')
			queryParameters.push(`${key}=${value}`)
		}
	}

	return queryParameters.join('&')
}

export function filterByDay<T>(
	items: T[],
	targetDate: string,
	dateGetter: (data: T) => string
): T[] {
	return items.filter(item => {
		const itemDate = dayjs(dateGetter(item)).format('YYYY-MM-DD')
		const inputDate = dayjs(targetDate).format('YYYY-MM-DD')
		return itemDate === inputDate
	})
}
