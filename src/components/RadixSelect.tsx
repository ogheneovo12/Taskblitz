import BsCheck2 from '@/assets/icons/check.svg'
import BsChevronDown from '@/assets/icons/chevron-down.svg'
import BsChevronUp from '@/assets/icons/chevron-up.svg'
import * as Select from '@radix-ui/react-select'
import cx from 'classnames'
import React, { type ReactElement } from 'react'

function RadixSelect({
	children,
	className,
	placeholder,
	hideCheveron,
	defaultValue,
	value,
	contentWidth = '',
	contentClassName,
	onValueChange
}: React.PropsWithChildren<{
	value?: string
	className?: string
	placeholder?: string
	hideCheveron?: boolean
	defaultValue?: string
	contentWidth?: string
	contentClassName?: string
	onValueChange?: (value: string) => void
}>): ReactElement {
	return (
		<Select.Root
			defaultValue={defaultValue}
			value={value}
			onValueChange={onValueChange}
		>
			<Select.Trigger className={cx(className)} aria-label='select'>
				<Select.Value placeholder={placeholder} />
				{!hideCheveron && (
					<Select.Icon className='text-violet11'>
						<BsChevronDown />
					</Select.Icon>
				)}
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					position='popper'
					side='bottom'
					align='start'
					style={{
						maxWidth: contentWidth
					}}
					className={cx(
						'dark:border-nav-dark dark:bg-nav-dark  w-screen overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
						contentClassName
					)}
				>
					<Select.ScrollUpButton className='text-nav-dark-700 flex h-[25px] cursor-default items-center justify-center bg-white'>
						<BsChevronUp />
					</Select.ScrollUpButton>
					<Select.Viewport>{children}</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}

export const SelectItem = React.forwardRef<
	HTMLDivElement,
	Select.SelectItemProps
>(
	(
		{ children, className, ...properties },
		forwardedReference: React.Ref<HTMLDivElement> | undefined
	) => (
		<Select.Item
			className={cx(
				'text-dark-blue-700 data-[disabled]:text-mauve8 data-[highlighted]:bg-primary-blue  relative   flex select-none items-center py-[14px] pl-[25px] pr-[35px] text-base leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none dark:text-white',
				className as string
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...properties}
			ref={forwardedReference}
		>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
				<BsCheck2 />
			</Select.ItemIndicator>
		</Select.Item>
	)
)

export const SelectSeperator = Select.Separator
RadixSelect.propTypes = {}

export default RadixSelect
