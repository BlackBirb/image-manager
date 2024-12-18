import { tag } from 'src/utils/utils'

import { db } from './db'

export const getUserPreferences = () => db.user.where('name').equals('user').first()
export const getAllTags = () => db.tags.toArray()
export const getTagAtIndex = (index: any) => db.tags.get(index)
export const searchTags = async (text: string) => {
  if (text) {
    // TODO: make it work with "anyOf"
    const value = await db.tags.where('name').startsWith(tag(text)).toArray()
    // console.log('value: ', value)
    return value
  }
  return getAllTags()
}
export const getAllImages = () => db.content.toArray()
export const getPaginationImages = (offset: number, limit: number) => db.content.offset(offset).limit(limit).toArray()
export const getAllImagesCount = () => db.content.count()
export const getContentWithId = (id: string) => db.content.where('id').equals(id).first()
