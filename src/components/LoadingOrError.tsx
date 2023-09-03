import cx from 'classnames'
import type { ReactElement } from 'react'
import { getErrorMessage } from 'utils'

interface Properties {
	error?: Error
	className?: string
}
export default function LoadingOrError({
	error,
	className
}: Properties): ReactElement {
	return (
		<div
			className={cx(
				`flex min-h-screen items-center justify-center `,
				className
			)}
		>
			<h1 className='text-xl' data-testid='LoadingOrError'>
				{error ? getErrorMessage(error) : 'Loading...'}
			</h1>
		</div>
	)
}
LoadingOrError.defaultProps = {
	error: undefined
}
