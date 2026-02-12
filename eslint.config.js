export default [
    {
        ignores: [
            'node_modules/**',
            'coverage/**',
            'dist/**',
            '.angular/**',
            'frontend/.angular/**',
            'frontend/dist/**',
            'frontend/node_modules/**',
            'frontend/coverage/**'
        ]
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules:{
            semi: ['error', 'always'], //Para el uso de ;
            quotes: ['error', 'single'], //Para comillas simples 
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], //Variables no usadas
            'no-console': 'off', //Permitir console.log
            'no-var': 'error', //No usar var, usar let o const
            'prefer-const': 'warn', //Preferir const cuando no se reasigna
            'eqeqeq': ['error', 'always'], //Usar === en vez de ==
            'curly': ['error', 'all'], //Siempre usar llaves en if, else, etc
            'no-multiple-empty-lines': ['warn', { max: 2 }], //Máximo 2 líneas vacías
        }
    }
];