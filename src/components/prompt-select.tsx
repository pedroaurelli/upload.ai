import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useClient } from '../hooks/use-client'
import { useQuery } from '@tanstack/react-query'

type PromptSelectProps = {
  onPromptSelect: (template: string) => void
}

export function PromptSelect({ onPromptSelect }: PromptSelectProps) {
  const client = useClient()

  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => client.getPrompts()
  })

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

    if (!selectedPrompt) return

    onPromptSelect(selectedPrompt.template)
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder='Choose one prompt template'/>
      </SelectTrigger>
      <SelectContent>
        {prompts && prompts.map(item => (
          <SelectItem value={item.id} key={item.id}>
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
