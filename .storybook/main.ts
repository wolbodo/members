import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	framework: '@storybook/sveltekit',
	stories: ['../src/**/*.stories.@(ts|svelte)'],
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-a11y', '@storybook/addon-vitest']
};

export default config;
