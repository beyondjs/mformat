import AnsiToHtml from 'ansi-to-html';
import { ITransformResult, SupportedFormat } from './types';
const toHtml = new AnsiToHtml();

export function formatBabelError(error: Error, format: SupportedFormat): ITransformResult {
	let message = toHtml.toHtml(error.message);
	message = message.replace(/\n/g, '<br/>');
	message = `<div style="background: #333; color: white;">${message}</div>`;
	message = `Error transforming to ${format} module: <br/><br/>${message}`;
	return { errors: [message] };
}
0;
