import { SavedImageInfo } from 'electron/preload'
import { TagName } from 'src/db/db'

export function removeItemFromArray(arr: string[], item: string) {
  return arr.filter((t) => t !== item)
}

// I have no ideas for the function name lol
export const tag = (str: string): TagName => str.replace(/[^a-zA-Z0-9\-_:]/, '').toLowerCase() as TagName

// copied over imageService because we can't import
export const getImageDir = (dir: string, image: SavedImageInfo, isThumbnail?: boolean) =>
  `${dir}/${image.hash.slice(0, 2)}/${image.hash.slice(2)}${isThumbnail ? '_thumbnail' : ''}.${image.ext}`
