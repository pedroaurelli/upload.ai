import { FileVideo, Github, Upload, Wand2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Slider } from './components/ui/slider'

export function App() {

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='px-6 py-3 flex items-center justify-between border-b'>
        <h1 className='text-xl font-bold'>upload.ai</h1>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>Development by Pedro Aureliano - NLW Project</span>
          <Separator orientation='vertical' className='h6'/>
          <Button variant='outline'>
            <Github className='w-4 h-4 mr-2'/>
            Github
          </Button>
        </div>
      </div>

      <main className='flex-1 p-6 flex gap-6'>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
            <Textarea
              placeholder='Tap your prompt'
              className='resize-none p-4 leading-relaxed'
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
          <form className='space-y-6'>
            <label
              htmlFor='video'
              className='border flex rounded-sm aspect-video cursor-pointer border-dashed text-sm flex-col items-center justify-center text-muted-foreground hover:bg-primary/5'
            >
              <FileVideo className='w-4 h-4 mr-2' />
              Upload video
            </label>
            <input type='file' id='video' className='sr-only' accept='video/mp4'/>
            <Separator />
            <div className='space-y-2'>
              <Label htmlFor='transcriptionPrompt'>
                Transcription Prompt
              </Label>
              <Textarea
                id='transcriptionPrompt'
                className='h-20 leading-relaxed resize-none'
                placeholder='Keywords mentioned in the video separated by commas (,)'
              />
            </div>
            <Button className='w-full'>
              Carregar video
              <Upload
                className='w-4 h-4 ml-2'
              />
            </Button>
          </form>

          <Separator />

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Choose one prompt template'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>YouTube title</SelectItem>
                  <SelectItem value='description'>YouTube description</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  )
}
