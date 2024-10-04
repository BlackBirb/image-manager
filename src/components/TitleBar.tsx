import { useElectronApi } from 'src/hooks/useElectronApi'
export default function TitleBar() {
  const electronApi = useElectronApi()
  const minimize = () => {
    electronApi.minimize()
  }
  const maximize = () => {
    electronApi.maximize()
  }
  const close = () => {
    electronApi.close()
  }
  return (
    <>
      {/* Will do it properly once i add material ui */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'gray',
        }}
      >
        <button className="interactive" onClick={minimize}>
          _
        </button>
        <button className="interactive" onClick={maximize}>
          []
        </button>
        <button className="interactive" onClick={close}>
          X
        </button>
      </div>
    </>
  )
}
