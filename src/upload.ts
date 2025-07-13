import { http, HttpResponse } from 'msw'

export async function upload(
  data :Blob,
  msw :boolean,
  onProgress ?:(bytes :number, total :number) => void,
) :Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()
      xhr.addEventListener('error', () => {
        reject(new Error('network error'))
      })
      xhr.addEventListener('load', () => {
        if (xhr.readyState === 4) {
          resolve(xhr.responseText)
        }
      })
      xhr.upload.addEventListener('progress', (e) => {
        if (typeof onProgress === 'function') {
          onProgress(e.loaded, e.total)
        }
      })
      xhr.open('POST', `http://localhost:8080/${msw ? 'test-msw' : 'test'}`, true)
      const fd = new FormData()
      fd.append('data', data)
      xhr.send(fd)
    }
    catch (e) {
      console.log('upload() - try-catch', e)
      reject(e as Error)
    }
  })
    .then((r) => {
      console.log('upload().then()', r)
    })
    .catch((e) => {
      console.log('upload().catch()', e)
    })
}

export const uploadMsw = http.post('http://localhost:8080/test-msw', async ({ request }) => {
  const body = await request.bytes()
  if (body.length === 0) {
    return HttpResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  return HttpResponse.json({ data: 'msw - ok' })
})
