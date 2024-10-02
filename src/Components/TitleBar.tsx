import { useElectronApi } from "../composables/useElectronApi"

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

  return (<>
    <div className="titlebar">
        <div style={ {flexGrow: 1} }>Peak design</div>
        <button className="interactive" onClick={minimize}>_</button>
        <button className="interactive" onClick={maximize}>[]</button>
        <button className="interactive" onClick={close}>X</button>
      </div>
  </>)
}