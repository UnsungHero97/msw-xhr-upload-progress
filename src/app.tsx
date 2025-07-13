import { setupWorker } from 'msw/browser'
import { useEffect, useState, type ChangeEvent } from 'react'

import mswPng from './msw.png'
import { upload, uploadMsw } from './upload'

const worker = setupWorker(uploadMsw)
void worker.start()

function App() {
  const [blob, setBlob] = useState<Blob>()
  const [msw, setMsw] = useState(true)
  const [progress, setProgress] = useState([0])
  const [state, setState] = useState<string>('initial')

  useEffect(() => {
    fetch(mswPng)
      .then((r) => r.blob())
      .then((b) => setBlob(b))
  }, [])

  useEffect(() => {
    reset()
    if (msw) {
      void worker.start()
    } else {
      void worker.stop()
    }
  }, [msw])

  const startTest = () => {
    setState('start')
    upload(blob!, msw, (bytes) => {
      setProgress((p) => [...p, bytes])
    })
    .then(() => {
      setState('done')
    })
  }

  const onChangeMsw = (e :ChangeEvent<HTMLInputElement>) => {
    setMsw(e.target.checked)
  }

  const reset = () => {
    setState('initial')
    setProgress([0])
  }

  return (
    <>
      <label>
        <input defaultChecked={msw} onChange={onChangeMsw} type="checkbox" />
        <span>msw</span>
      </label>
      <button onClick={startTest}>start test</button>
      <div>state - {state}</div>
      <div>
        {progress.map((p, i) => (
          <div key={`${i}_${p}`}>bytes - {p}</div>
        ))}
      </div>
    </>
  )
}

export default App
