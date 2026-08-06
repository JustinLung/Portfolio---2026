import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const endpoint = process.env.WORDPRESS_GRAPHQL_URL;

if (!endpoint) {
	throw new Error('WORDPRESS_GRAPHQL_URL is not configured');
}

const config: CodegenConfig = {
	overwrite: true,
	schema: endpoint,
	documents: ['src/lib/graphql/**/*.{ts,gql,graphql}', '!src/lib/graphql/generated/**'],
	generates: {
		'src/lib/graphql/generated/graphql.ts': {
			plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
			config: {
				useTypeImports: true
			}
		},
		'src/lib/graphql/generated/graphql.schema.json': {
			plugins: ['introspection']
		}
	},
	hooks: {
		afterAllFileWrite: ['prettier --write']
	}
};

export default config;
