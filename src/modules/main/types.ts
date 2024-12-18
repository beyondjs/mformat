export interface ITransformResult {
	code?: string;
	map?: any;
	errors?: string[];
}

export type SupportedFormat = 'amd' | 'cjs' | 'esm' | 'sjs';
