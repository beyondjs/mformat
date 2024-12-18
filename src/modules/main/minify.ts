import { minify } from 'uglify-js';
import { ITransformResult } from './types';

export function minifyCode(code: string, map?: any): ITransformResult {
	try {
		const minified = minify(code, { sourceMap: { content: map } });
		if (minified.error) {
			return { errors: [minified.error.message] };
		}
		return { code: minified.code, map: minified.map ?? undefined };
	} catch (error: any) {
		return { errors: [error.message] };
	}
}
