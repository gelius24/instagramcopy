import MiniProfile from "./MiniProfile"
import Posts from "./Posts"

export default function Feed() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 md:max-w-6xl mx-auto">
      {/* left side - posts */}
      <section className="md:col-span-2">
        <Posts/>
      </section>
      {/* right side - profile */}
      <section className="hidden md:inline-grid md:col-span-1">
        <div className="fixed w-[380px]">
          <MiniProfile/>
        </div>
      </section>
    </main>
  )
}