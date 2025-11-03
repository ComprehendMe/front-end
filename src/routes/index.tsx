import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/header'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="px-[80px] py-[40px] border border-red-500">
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <Header />
      <main className="flex flex-col justify-center items-center text-center border min-h-screen">
        <div className="flex flex-col gap-[20px]">
          <h1 className="text-[40px] font-bold">CogniAI</h1>
          <p className="text-[16px]">CogniAI is a platform for AI-powered solutions.</p>
        </div>
      </main>
    </div>
  )
}
