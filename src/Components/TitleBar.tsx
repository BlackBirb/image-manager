
export default function TitleBar() {
  const minimize = () => {
    window.api.minimize()
  }
  const maximize = () => {}
  const close = () => {}

  return (<>
    <div className="titlebar">
        <div style={ {flexGrow: 1} }>Peak design</div>
        <button className="interactive" onClick={minimize}>_</button>
        <button className="interactive" onClick={maximize}>[]</button>
        <button className="interactive" onClick={close}>X</button>
      </div>
  </>)
}