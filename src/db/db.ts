// db.ts
import DexieBase, { Table } from 'dexie'

type UserPreferences = {
  id?: number
  name: string
  defaultContentType: ContentType
  folderPath: string
  pagination: number
}

type UserPreferencesTable = {
  user: Table<UserPreferences>
}

const userPreferencesSchema = {
  user: '++id, name',
}

// In theory only tag() util function should return this
// so it screams if you forget it
export type TagName = string & { __brand: 'TagName' }

export type Tag = {
  id?: number
  name: TagName
  createdAt: number
  updatedAt: number
}

type TagTable = {
  tags: Table<Tag>
}

const tagsSchema = {
  tags: '++id, name',
}

export type ContentType = 'sfw' | 'nsfw' | 'questionable'

type Content = {
  id: string
  tags: Tag[]
  contentType: ContentType
  sourceUrl: string
  additionalUrls: string[]
  type: 'image' | 'video' | 'gif'
  createdAt: number
  updatedAt: number
}

type ContentTable = {
  content: Table<Content>
}

const contentSchema = {
  content: 'id, *tags, contentType, createdAt, updatedAt',
}

type DexieTables = UserPreferencesTable & TagTable & ContentTable
export type Dexie<T extends any = DexieTables> = DexieBase & T

const db = new DexieBase('ImageDatabase') as Dexie

// Schema declaration:
const schema = Object.assign({}, userPreferencesSchema, tagsSchema, contentSchema)

db.version(1).stores(schema)

export { db }

// Syntax For Indexes
// keyPath		                Means that keyPath is indexed
// &keyPath	Unique	          Means that keyPath is indexed and keys must be unique
// *keyPath	Multi-valued	    Means that if key is an array, each array value will be regarded as a key to the object.
// [keyPath1+keyPath2]	      Compound	Defining a compound index for keyPath1 and keyPath2
