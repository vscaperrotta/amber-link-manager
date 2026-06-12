import { useState } from 'react'
import Input from './Input'

export default {
	title: 'Components/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		type: { control: 'select', options: ['text', 'email', 'password', 'search', 'url'] },
		onChange: { action: 'changed' },
	},
}

export const Default = {
	args: {
		id: 'name',
		label: 'Name',
		placeholder: 'Enter name...',
	},
}

export const WithValue = {
	args: {
		id: 'url',
		label: 'URL',
		value: 'https://example.com',
	},
}

export const WithError = {
	args: {
		id: 'email',
		label: 'Email',
		value: 'not-an-email',
		error: 'Enter a valid email address',
	},
}

export const Disabled = {
	args: {
		id: 'disabled',
		label: 'Disabled field',
		value: 'Cannot edit this',
		disabled: true,
	},
}

export const Required = {
	args: {
		id: 'required',
		label: 'Required field',
		placeholder: 'This field is required...',
		required: true,
	},
}

export const SearchType = {
	args: {
		id: 'search',
		label: 'Search',
		placeholder: 'Search links...',
		type: 'search',
	},
}

export const Controlled = {
	render: () => {
		const [value, setValue] = useState('')
		return (
			<Input
				id="controlled"
				label="Controlled input"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Type something..."
			/>
		)
	},
}
