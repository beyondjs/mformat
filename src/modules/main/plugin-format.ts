import { SupportedFormat } from './types';

export function getPluginForFormat(format: SupportedFormat): (string | [string, Record<string, unknown>])[] {
	const options = { importInterop: 'none' };

	switch (format) {
		case 'amd':
			return [['@babel/plugin-transform-modules-amd', options]];
		case 'cjs':
			return [['@babel/plugin-transform-modules-commonjs', options]];
		case 'sjs':
			return [['@babel/plugin-transform-modules-systemjs', options], '@babel/plugin-proposal-dynamic-import'];
		default:
			// 'esm' should never reach here since we return early if format === 'esm'
			return [];
	}
}
