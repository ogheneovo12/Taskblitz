import type { ReactElement } from 'react'
import { useState } from 'react'

function Avatar({
	src,
	alt,
	text = ''
}: {
	src: string
	alt: string
	text?: string
}): ReactElement {
	const [imageError, setImageError] = useState(false)

	const onHandleImageError = (): void => {
		setImageError(true)
	}

	return (
		<div className='flex h-10 w-10 items-center justify-center rounded-full bg-black bg-opacity-5 text-center'>
			{imageError ? (
				<span className=' text-sm font-semibold text-black'>{text}</span>
			) : (
				<img
					src={src}
					alt={alt}
					onError={onHandleImageError}
					className='h-full w-full rounded-full object-cover'
				/>
			)}
		</div>
	)
}

export default Avatar
