import { db } from './db'

export const getUserPreferences = () => db.user.where('name').equals('user').first()
