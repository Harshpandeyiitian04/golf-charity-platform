'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Trophy, ArrowLeft, Play, Send, Zap, Shuffle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDrawsPage() {
    const router = useRouter()
    const [draws, setDraws] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [running, setRunning] = useState(false)
    const [publishing, setPublishing] = useState<string | null>(null)
    const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random')
    const [month, setMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [simulationResult, setSimulationResult] = useState<any>(null)

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: profile } = await supabase
            .from('profiles').select('is_admin').eq('id', session.user.id).single()
        if (!profile?.is_admin) { router.push('/dashboard'); return }
        loadDraws()
    }

    const loadDraws = async () => {
        const { data } = await supabase
            .from('draws')
            .select('*')
            .order('created_at', { ascending: false })
        setDraws(data || [])
        setLoading(false)
    }

    const runSimulation = async () => {
        setRunning(true)
        setSimulationResult(null)

        const res = await fetch('/api/admin/draws', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drawType, month, simulate: true }),
        })

        const data = await res.json()
        if (data.error) {
            toast.error(data.error)
        } else {
            setSimulationResult(data)
            toast.success('Simulation complete!')
        }
        setRunning(false)
    }

    const publishDraw = async () => {
        if (!simulationResult) {
            toast.error('Run a simulation first')
            return
        }

        setRunning(true)

        const res = await fetch('/api/admin/draws', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drawType, month, simulate: false }),
        })

        const data = await res.json()
        if (data.error) {
            toast.error(data.error)
        } else {
            toast.success('Draw published successfully!')
            setSimulationResult(null)
            loadDraws()
        }
        setRunning(false)
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-yellow-400 animate-pulse">Loading draws...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="pt-8 pb-16 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Trophy size={28} className="text-yellow-400" />
                            <h1 className="text-3xl font-black text-white">Draw Management</h1>
                        </div>
                    </div>

                    {/* Draw Config */}
                    <div className="bg-white/5 border border-yellow-500/30 rounded-3xl p-6 mb-8">
                        <h2 className="text-white font-bold text-lg mb-5">Configure New Draw</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Month */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Draw Month</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={e => setMonth(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            {/* Draw Type */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Draw Type</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDrawType('random')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${drawType === 'random'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        <Shuffle size={16} />
                                        Random
                                    </button>
                                    <button
                                        onClick={() => setDrawType('algorithmic')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${drawType === 'algorithmic'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        <Zap size={16} />
                                        Algorithmic
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={runSimulation}
                                disabled={running}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold py-3 rounded-xl hover:bg-yellow-500/30 transition-all disabled:opacity-50"
                            >
                                <Play size={18} />
                                {running ? 'Running...' : 'Run Simulation'}
                            </button>
                            <button
                                onClick={publishDraw}
                                disabled={running || !simulationResult}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400 transition-all disabled:opacity-50"
                            >
                                <Send size={18} />
                                Publish Draw
                            </button>
                        </div>
                    </div>

                    {/* Simulation Result */}
                    {simulationResult && (
                        <div className="bg-white/5 border border-green-500/30 rounded-3xl p-6 mb-8">
                            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                <Zap size={20} className="text-green-400" />
                                Simulation Results — Preview Only
                            </h2>

                            {/* Drawn Numbers */}
                            <div className="mb-6">
                                <p className="text-gray-400 text-sm mb-3">Drawn Numbers:</p>
                                <div className="flex gap-3 flex-wrap">
                                    {simulationResult.drawnNumbers?.map((n: number) => (
                                        <div
                                            key={n}
                                            className="w-12 h-12 rounded-full bg-yellow-500 text-black font-black text-lg flex items-center justify-center shadow-lg shadow-yellow-500/30"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Prize Pools */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
                                    <div className="text-yellow-400 font-black text-xl">
                                        £{simulationResult.pools?.fiveMatch?.toFixed(2) || '0.00'}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">Jackpot (5-match)</div>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                                    <div className="text-green-400 font-black text-xl">
                                        £{simulationResult.pools?.fourMatch?.toFixed(2) || '0.00'}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">2nd Prize (4-match)</div>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                                    <div className="text-blue-400 font-black text-xl">
                                        £{simulationResult.pools?.threeMatch?.toFixed(2) || '0.00'}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">3rd Prize (3-match)</div>
                                </div>
                            </div>

                            {/* Winners */}
                            <div>
                                <p className="text-gray-400 text-sm mb-3">
                                    Potential Winners ({simulationResult.winners?.length || 0}):
                                </p>
                                {simulationResult.winners?.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No winners this draw — jackpot would roll over.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {simulationResult.winners?.map((w: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                                                <div>
                                                    <span className="text-white text-sm font-medium">{w.email}</span>
                                                    <div className="text-gray-400 text-xs">Scores: {w.userNumbers?.join(', ')}</div>
                                                </div>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${w.matchType === '5-match' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        w.matchType === '4-match' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {w.matchType} — £{w.prize?.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="text-yellow-400 text-xs mt-4">
                                ⚠️ This is a simulation only. Click "Publish Draw" to make it official.
                            </p>
                        </div>
                    )}

                    {/* Past Draws */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <h2 className="text-white font-bold text-lg mb-5">Past Draws</h2>
                        {draws.length === 0 ? (
                            <p className="text-gray-400 text-sm">No draws published yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {draws.map((draw) => (
                                    <div key={draw.id} className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-4">
                                        <div>
                                            <div className="text-white font-semibold">{draw.month}</div>
                                            <div className="text-gray-400 text-xs capitalize">{draw.draw_type} draw</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {draw.drawn_numbers?.map((n: number) => (
                                                    <span key={n} className="w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center justify-center">
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${draw.status === 'published'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {draw.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}