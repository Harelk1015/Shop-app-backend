module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['airbnb-base'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'import/no-unresolved': 'off',
		'import/extensions': 'off',
		'no-tabs': 'off',
		'indent': 'off',
		'consistent-return': 'off',
		'no-control-regex': 'off',
		'no-underscore-dangle': 'off',
		'no-unused-vars': 'off',
		'array-callback-return': 'off',
		'max-len': 'off',
	},
};
