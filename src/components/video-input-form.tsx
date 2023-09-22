import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-separator'
import { FileVideo, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { getFFmepg } from '../lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '../lib/client/client'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  waiting: 'Waiting for video',
  converting: 'Converting video to audio',
  uploading: 'Uploading audio to server',
  generating: 'Generating transcription',
  success: 'Success!'
}

type VideoInputFormProps = {
  onVideoUpload: (id: string) => void
}

export function VideoInputForm({ onVideoUpload }: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected (event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    const ffmepg = await getFFmepg()

    await ffmepg.writeFile('input.mp4', await fetchFile(video))

    ffmepg.on('progress', progress => {
      console.log('Convert process:' + Math.round(progress.progress * 100))
    })

    await ffmepg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmepg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg'
    })

    return audioFile
  }

  async function handleUploadVideo (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if(!videoFile) return

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    console.log(response)

    const videoId = response.data.id

    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, { prompt })

    setStatus('success')

    onVideoUpload(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className='space-y-6' onSubmit={handleUploadVideo}>
      <label
        htmlFor='video'
        className='relative border flex rounded-sm aspect-video cursor-pointer border-dashed text-sm flex-col items-center justify-center text-muted-foreground hover:bg-primary/5'
      >
        {previewURL
          ? (
            <>
              <video
                src={previewURL}
                controls={false}
                className='pointer-events-none absolute inset-0'
              />
            </>
          )
          : (
            <>
              <FileVideo className='w-4 h-4 mr-2' />
              Upload video
            </>
          )
        }

      </label>
      <input type='file' id='video' className='sr-only' accept='video/mp4' onChange={handleFileSelected}/>
      <Separator />
      <div className='space-y-2'>
        <Label htmlFor='transcriptionPrompt'>
          Transcription Prompt
        </Label>
        <Textarea
          id='transcriptionPrompt'
          className='h-20 leading-relaxed resize-none'
          placeholder='Keywords mentioned in the video separated by commas (,)'
          ref={promptInputRef}
          disabled={status != 'waiting'}
        />
      </div>
      <Button
        className='w-full data-[success=true]:bg-emerald-400'
        type='submit'
        disabled={status != 'waiting'}
        data-success={status == 'success'}
      >
        {statusMessages[status]}
        {status === 'waiting' && (
          <Upload
            className='w-4 h-4 ml-2'
          />
        )}
      </Button>
    </form>
  )
}
