import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/header'
import { Layout } from './components/layout'
import { MainSection } from './components/main-section'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Header />
        <MainSection />
      </Layout>
    </QueryClientProvider>
  )
}
