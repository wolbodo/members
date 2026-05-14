import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';

const preview: Preview = {
	parameters: {
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		backgrounds: {
			default: 'wolbodo-dark',
			values: [
				{ name: 'wolbodo-dark', value: '#131110' },
				{ name: 'surface', value: '#1e1c1a' },
				{ name: 'light', value: '#ffffff' }
			]
		}
	}
};

export default preview;
