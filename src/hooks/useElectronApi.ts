import { useEffect, useState } from 'react'

export const useElectronApi = (): ElectronAPI => window.api

export const useWindowMaximize = (): [boolean | null, () => Promise<void>] => {
  const [isMaximized, setIsMaximized] = useState(false)

  // This is hell, I miss my singals from vue
  useEffect(() => window.api.onWindowMaximize((evn) => setIsMaximized(evn)))

  const toggleMaximize = async () => setIsMaximized(await window.api.toggleMaximize())
  return [isMaximized, toggleMaximize]
}
