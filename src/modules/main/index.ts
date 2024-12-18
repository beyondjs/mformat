import { transform } from '@babel/core';
import * as path from 'path';

import { formatBabelError } from './error';
import { minifyCode } from './minify';
import { ITransformResult, SupportedFormat } from './types';
import { getPluginForFormat } from './plugin-format';

interface TransformSpecs {
	code: string;
	map?: any;
	format?: SupportedFormat;
	minify?: boolean;
}

const formats: SupportedFormat[] = ['sjs', 'amd', 'cjs', 'esm'];

export function transformCode(specs: TransformSpecs): ITransformResult {
	const { code, map } = specs;
	let { format, minify: shouldMinify } = specs;
	format = format || 'esm';
	shouldMinify = shouldMinify || false;

	// Validate input
	if (!code) {
		return { errors: ['Code specification is not defined'] };
	}

	if (!formats.includes(format)) {
		return { errors: ['Invalid parameters: format must be one of amd, esm, cjs, sjs'] };
	}

	// If ESM, return as-is
	if (format === 'esm') {
		// Optionally minify if requested
		return shouldMinify ? minifyCode(code, map) : { code, map };
	}

	// Determine Babel plugin based on the format
	const plugin = getPluginForFormat(format);

	// Transform the code using Babel
	let transformed;
	try {
		transformed = transform(code, {
			cwd: path.join(__dirname),
			sourceMaps: !!map,
			inputSourceMap: map,
			compact: false,
			plugins: plugin
		});
	} catch (error: any) {
		return formatBabelError(error, format);
	}

	if (!transformed || !transformed.code) {
		return { errors: ['Babel transform did not produce output'] };
	}

	const transformedCode = transformed.code;
	const transformedMap = transformed.map ? transformed.map : undefined;

	// If minification is requested
	if (shouldMinify) {
		return minifyCode(transformedCode, transformedMap);
	}

	return { code: transformedCode, map: transformedMap };
}

// Export the formats array for external use
export { formats };
