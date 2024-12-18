# Babel Transformation Utility

This codebase provides a utility function to transform JavaScript code from ES modules to various module formats (`amd`,
`cjs`, `esm`, `sjs`) using Babel, and optionally minify the output. It also handles transformation errors and converts
ANSI escape codes in error messages to HTML for improved readability.

## Overview

The main entry point is the `transformCode` function defined in `main/index.ts`. It accepts a code string, an optional
source map, a target module format, and a flag to enable minification. Based on the provided format, it applies the
corresponding Babel plugins to transform the input code.

**Key Features:**

-   Supported formats: `esm`, `amd`, `cjs`, `sjs` (SystemJS)
-   Optional code minification using `uglify-js`
-   ANSI to HTML conversion for detailed and visually enhanced error messages
-   Configurable Babel transformations based on the chosen module format

## File Structure

```
main/ 
    ├─ index.ts // Main entry point for code transformation 
    ├─ error.ts // Error formatting utilities (converts ANSIto HTML) 
    ├─ minify.ts // Minification logic using 'uglify-js' 
    ├─ plugin-format.ts // Returns appropriate Babel plugins for the given format.
    └─ types.ts // Common interfaces and types

```

### `main/index.ts`

-   Exports the `transformCode` function, which:
    -   Validates input parameters
    -   Directly returns ESM code as-is if `format = 'esm'`
    -   Uses `getPluginForFormat` to determine the correct Babel plugins
    -   Handles Babel transformations and catches errors
    -   Optionally invokes `minifyCode` for minimized output
-   Exports the `formats` array listing all supported output formats.

### `main/error.ts`

-   Uses the `ansi-to-html` package to convert ANSI codes into HTML.
-   Wraps and styles error messages, making them more readable in a browser or UI context.

### `main/minify.ts`

-   Uses `uglify-js` to minify transformed code.
-   Returns the minified code and source map if available.

### `main/plugin-format.ts`

-   Provides a helper function to choose the right Babel plugin(s) based on the requested format:
    -   `amd` -> `@babel/plugin-transform-modules-amd`
    -   `cjs` -> `@babel/plugin-transform-modules-commonjs`
    -   `sjs` -> `@babel/plugin-transform-modules-systemjs` and `@babel/plugin-proposal-dynamic-import`
-   `esm` format requires no additional plugins (handled directly in `index.ts`).

### `main/types.ts`

-   Defines the `ITransformResult` interface, which represents the transformation result (either `code` and `map` or an
    `errors` array).
-   Defines the `SupportedFormat` type, representing acceptable module formats.

## Dependencies

-   **@babel/core** for code transformation
-   **ansi-to-html** for converting terminal output into HTML
-   **uglify-js** for minifying the output code
-   **@babel/plugin-transform-modules-\* and @babel/plugin-proposal-dynamic-import** for handling different module
    formats

## Usage

1. **Install Dependencies:**

    ```bash
    npm install @babel/core ansi-to-html uglify-js @babel/plugin-transform-modules-amd @babel/plugin-transform-modules-commonjs @babel/plugin-transform-modules-systemjs @babel/plugin-proposal-dynamic-import
    ```

2. **Call `transformCode`:**

    ```typescript
    import { transformCode } from './main';

    const result = transformCode({
    	code: 'export const foo = "bar";',
    	format: 'cjs',
    	minify: true
    });

    if (result.errors) {
    	console.error('Errors:', result.errors);
    } else {
    	console.log('Transformed Code:', result.code);
    }
    ```

## Notes

-   If `format` is `esm`, the code is returned as-is (except if `minify` is enabled).
-   For `amd`, `cjs`, or `sjs`, the code is passed through Babel transformations.
-   If Babel throws an error, the error message is formatted with HTML for easier reading and returned in the `errors`
    array.
-   Minification is optional and enabled via the `minify` boolean option.
