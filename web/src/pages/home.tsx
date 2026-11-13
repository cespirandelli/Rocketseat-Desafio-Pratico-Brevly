import { LinksList } from '@/components/links-list'
import { Logo } from '@/components/logo'
import { NewLinkForm } from '@/components/new-link-form'

export function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[980px] flex-col gap-6 px-3 py-8 lg:gap-8 lg:py-22">
      <header className="flex justify-center lg:justify-start">
        <Logo />
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
        <NewLinkForm className="lg:w-[380px] lg:shrink-0" />
        <LinksList className="lg:min-w-0 lg:flex-1" />
      </div>
    </main>
  )
}
