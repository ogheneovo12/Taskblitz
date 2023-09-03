import emptyElement from '@/assets/images/empty.png'
import type { ReactElement } from 'react'

function IsEmpty({
	title,
	description
}: {
	title?: string
	description?: string
}): ReactElement {
	return (
		<div className='mx-auto flex min-h-[400px] w-full max-w-[750px] flex-col items-center justify-center rounded-lg bg-white px-4 text-center shadow-lg'>
			<img src={emptyElement} alt='empty element illustration' />
			<h3 className=' mt-4 text-2xl text-[#38a169]'>{title}</h3>
			<p className='text-[#a2a5b9]'>{description}</p>
		</div>
	)
}

IsEmpty.propTypes = {}

export default IsEmpty
