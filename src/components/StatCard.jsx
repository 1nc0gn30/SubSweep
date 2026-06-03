export default function StatCard({ label, value, accent }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? 'text-' + accent : 'text-zinc-100'}`}>
        {value}
      </div>
    </div>
  )
}
