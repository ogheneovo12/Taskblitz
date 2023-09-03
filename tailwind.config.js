const defaultConfig = require('tailwindcss/defaultConfig')
const formsPlugin = require('@tailwindcss/forms')

/** @type {import('tailwindcss/types').Config} */
const config = {
	content: ['index.html', 'src/**/*.tsx'],
	theme: {
		extend: {
			container: {
				center: true,
				padding: {
					DEFAULT: '1em',
					xl: '1rem'
				}
			},
			fontFamily: {
				sans: ['Work Sans', ...defaultConfig.theme.fontFamily.sans]
			},
			colors: {
				primary: '#3F5BF6',
				active: '#EAEDFE',
				inactive: '#D0D5DD',
				'foundation-grey-normal': '#272727'
			},
			boxShadow: {
				calendar:
					'0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
				btn: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)'
			},
			keyframes: {
				slideUpAndFade: {
					from: { opacity: 0, transform: 'translateY(2px)' },
					to: { opacity: 1, transform: 'translateY(0)' }
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: 'translateX(-2px)' },
					to: { opacity: 1, transform: 'translateX(0)' }
				},
				slideDownAndFade: {
					from: { opacity: 0, transform: 'translateY(-2px)' },
					to: { opacity: 1, transform: 'translateY(0)' }
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: 'translateX(2px)' },
					to: { opacity: 1, transform: 'translateX(0)' }
				}
			},
			animation: {
				slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade:
					'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideDownAndFade:
					'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)'
			}
		}
	},
	experimental: { optimizeUniversalDefaults: true },
	plugins: [formsPlugin]
}
module.exports = config
