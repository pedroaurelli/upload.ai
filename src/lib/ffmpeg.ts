import { FFmpeg } from '@ffmpeg/ffmpeg'

import coreURL from '../ffmpeg/ffmpeg-core.js?url'
import wasmURL from '../ffmpeg/ffmpeg-core.wasm?url'
import workerURL from '../ffmpeg/ffmpeg-worker.js?url'

let ffmepg: FFmpeg | null

export async function getFFmepg() {
  if (ffmepg) {
    console.log('old instance')
    return ffmepg
  }

  console.log('new instance')
  ffmepg = new FFmpeg()

  if (!ffmepg.loaded) {
    console.log('load')
    await ffmepg.load({
      coreURL,
      wasmURL,
      workerURL
    })
  }

  console.log('return instance')
  return ffmepg
}
