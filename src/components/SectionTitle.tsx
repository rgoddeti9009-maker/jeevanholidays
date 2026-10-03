export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-saffron-deep">{kicker}</div>
      <h2 className="text-3xl font-extrabold uppercase md:text-4xl">{title}</h2>
      <div className="dot-rule mt-2 w-24" />
    </div>
  )
}
