import { useCallback, useMemo, useState } from 'react'
import { MousePositionType } from 'src/components/RightClickMenu'

export const useMousePositionClick = () => {
  const [mousePosition, setMousePosition] = useState<MousePositionType | null>(null)

  const handleOnCloseMenu = useCallback(() => [setMousePosition(null)], [])

  const handleRightClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      console.log('event: ', event)
      event.preventDefault()
      if (event.nativeEvent.button === 0) {
        handleOnCloseMenu()
      }
      if (event.nativeEvent.button === 2) {
        setMousePosition({
          x: event.clientX + 2,
          y: event.clientY - 6,
        })
      }
    },
    [handleOnCloseMenu],
  )

  return useMemo(() => {
    return {
      mousePosition,
      handleRightClick,
      handleOnCloseMenu,
    }
  }, [mousePosition, handleRightClick, handleOnCloseMenu])
}
