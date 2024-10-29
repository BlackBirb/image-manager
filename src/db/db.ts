// db.ts
import DexieBase, { Table } from 'dexie'

export type ContentExplicityType = 'sfw' | 'nsfw' | 'questionable'
export type ContentType = 'image' | 'video' | 'gif'

type UserPreferences = {
  id?: number
  name: string
  defaultContentType: ContentExplicityType
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

export type Content = {
  id: string
  tags: TagName[]
  contentType: ContentExplicityType
  sourceUrl: string
  additionalUrls: string[]
  type: ContentType
  ext: string
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

// Nukes the DB. Need to restart the app as this also closes the connection
// to the DB. Deletes EVERYTHING!!!
// Need to remove this once we deploy it for "commercial" use.
const DELETE_DB = () => {
  db.delete()
    .then(() => {
      console.info('Database deleted successfully')
      console.info('You need to restart the app!')
    })
    .catch((err) => {
      console.error('Failed to delete database!')
      console.error('err: ', err)
    })
    .finally(() => {
      // Do what should be done next...
    })
}

export { db, DELETE_DB }

// Syntax For Indexes
// keyPath		                Means that keyPath is indexed
// &keyPath	Unique	          Means that keyPath is indexed and keys must be unique
// *keyPath	Multi-valued	    Means that if key is an array, each array value will be regarded as a key to the object.
// [keyPath1+keyPath2]	      Compound	Defining a compound index for keyPath1 and keyPath2
