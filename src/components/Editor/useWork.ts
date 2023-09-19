import * as monaco from 'monaco-editor'
import 'monaco-yaml/yaml.worker.js'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import YamlWorker from './yaml.work.js?worker'
// @ts-ignore
import { configureMonacoYaml } from 'monaco-yaml'

self.MonacoEnvironment = {
  getWorker(_, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new editorWorker()
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

configureMonacoYaml(monaco, {
  enableSchemaRequest: true,
  schemas: [
    {
      // If YAML file is opened matching this glob
      fileMatch: ['**/.prettierrc.*'],
      // Then this schema will be downloaded from the internet and used.
      uri: 'https://json.schemastore.org/prettierrc.json',
    },
    {
      // If YAML file is opened matching this glob
      fileMatch: ['**/person.yaml'],
      // The following schema will be applied
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The person’s display name',
          },
          age: {
            type: 'integer',
            description: 'How old is the person in years?',
          },
          occupation: {
            enum: ['Delivery person', 'Software engineer', 'Astronaut'],
          },
        },
      },
      // And the following URI will be linked to as the source.
      uri: 'https://github.com/remcohaszing/monaco-yaml#usage',
    },
  ],
})
