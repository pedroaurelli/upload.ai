import { Wand2 } from 'lucide-react'
import { PromptSelect } from './prompt-select'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { VideoInputForm } from './video-input-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Slider } from './ui/slider'
import { useState } from 'react'
import { useCompletion } from 'ai/react'

export function MainSection() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input,
    setInput
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    }
  })

  return (
    <main className='flex-1 p-6 flex gap-6'>
    <div className='flex flex-col flex-1 gap-4'>
      <div className='grid grid-rows-2 gap-4 flex-1'>
        <Textarea
          placeholder='Tap your prompt'
          className='resize-none p-4 leading-relaxed'
          value={input}
        />
        <Textarea
          placeholder='IA result generator'
          className='resize-none p-4 leading-relaxed'
          readOnly
        />
      </div>
      <p className='text-sm text-muted-foreground'>
        Ps: You can use the variable <code className='text-violet-400'>{'{transcription}'}</code> in your prompt
      </p>
    </div>

    <aside className='w-80 space-y-6'>
      <VideoInputForm onVideoUpload={setVideoId}/>
      <Separator />

      <form className='space-y-6'>
        <div className='space-y-2'>
          <Label>Prompt template</Label>
          <PromptSelect onPromptSelect={setInput}/>
        </div>

        <div className='space-y-2'>
          <Label>Model</Label>
          <Select disabled defaultValue='gpt3.5'>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>
          <span className='block text-xs text-muted-foreground italic'>
            You can customize this option soon...
          </span>
        </div>

        <Separator />

        <div className='space-y-4'>
          <Label>Temperature</Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={value => setTemperature(value[0])}
          />
          <span className='block text-xs text-muted-foreground italic leading-relaxed'>
            Highest temperature means more randomness
          </span>
        </div>

        <Separator />

        <Button
          type='submit'
          className='w-full'
        >
          Submit
          <Wand2 className='w-4 h-4 ml-2' />
        </Button>

      </form>
    </aside>
  </main>
  )
}
