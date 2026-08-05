import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './projectType'
import { serviceType } from './serviceType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType],
}
