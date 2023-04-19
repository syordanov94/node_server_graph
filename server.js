import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { printSchema } from 'graphql'
import { addResolversToSchema } from '@graphql-tools/schema'
import { createServer } from '@graphql-yoga/node'
import cloneAndPullRepo from './github/cloneAndPullRepo.js';
import fs from 'fs';

const globPath = './**/*.graphql'

async function main() {  

  var username = process.argv[2] // syordanov94
  var project = process.argv[3] // graphql-schema
  var branch = process.argv[4] // clean_schema

  // --- (1) ----
  // Pull schema from GitHub
  cloneAndPullRepo(fs.existsSync(`repos/${username}/${project}`),username,project,branch)

  // --- (2) ----
  // Prepare schema and resolvers
  // load from multiple files using glob
  const schema = await loadSchemaSync(globPath, {
    // load files and merge them into a single schema object
    loaders: [new GraphQLFileLoader()]
  })

  console.log(printSchema(schema))

  // Write some resolvers
  const resolvers = {}

  // Add resolvers to the schema
  const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers
  })


  // --- (3) ----
  // Create and run Server
  const server = createServer({
    schema: schemaWithResolvers
  })

  await server.start()

}

main().catch(error => console.error(error))