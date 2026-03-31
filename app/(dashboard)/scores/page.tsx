'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Target, Plus, Trash2, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ScoresPage() {
    const router = useRouter()
    const [scores, setScores] = useState<any[]>([])
    const [score, setScore] = useState('')
    const [playedOn, setPlayedOn] = useState('')
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        loadScores()
    }, [])

    const loadScores = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        setUserId(session.user.id)

        const { data } = await supabase
            .from('scores')
            .select('*')
            .eq('user_id', session.user.id)
            .order('played_on', { ascending: false })

        setScores(data || [])
        setLoading(false)
    }

    const handleAddScore = async (e: React.FormEvent) => {
        e.preventDefault()

        const scoreNum = Number(score)
        if (scoreNum < 1 || scoreNum > 45) {
            toast.error('Score must be between 1 and 45')
            return
        }

        if (!playedOn) {
            toast.error('Please select a date')
            return
        }

        setAdding(true)

        // If already 5 scores, delete the oldest first
        if (scores.length >= 5) {
            const oldest = [...scores].sort(
                (a, b) => new Date(a.played_on).getTime() - new Date(b.played_on).getTime()
            )[0]

            await supabase.from('scores').delete().eq('id', oldest.id)
            toast('Oldest score removed to make room', { icon: '🔄' })
        }

        // Insert new score
        const { error } = await supabase.from('scores').insert({
            user_id: userId,
            score: scoreNum,
            played_on: playedOn,
        })

        if (error) {
            toast.error('Failed to add score: ' + error.message)
            setAdding(false)
            return
        }

        toast.success('Score added!')
        setScore('')
        setPlayedOn('')
        loadScores()
        setAdding(false)
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('scores').delete().eq('id', id)
        if (error) {
            toast.error('Failed to delete score')
            return
        }
        toast.success('Score removed')
        loadScores()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-green-400 animate-pulse">Loading scores...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Target size={28} className="text-blue-400" />
                            <h1 className="text-3xl font-black text-white">My Scores</h1>
                        </div>
                        <p className="text-gray-400">
                            Enter your Stableford scores (1–45). Only your latest 5 are kept.
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8 flex gap-3">
                        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                            <strong>How it works:</strong> Your 5 most recent scores become your draw numbers each month.
                            When you add a 6th score, the oldest one is automatically removed.
                            Scores must be in Stableford format (1–45 points).
                        </div>
                    </div>

                    {/* Score Entry Form */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                            <Plus size={20} className="text-green-400" />
                            Add New Score
                        </h2>
                        <form onSubmit={handleAddScore} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">
                                        Stableford Score
                                    </label>
                                    <input
                                        type="number"
                                        value={score}
                                        onChange={e => setScore(e.target.value)}
                                        min={1}
                                        max={45}
                                        required
                                        placeholder="e.g. 32"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                                    />
                                    <p className="text-gray-500 text-xs mt-1">Between 1 and 45</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">
                                        Date Played
                                    </label>
                                    <input
                                        type="date"
                                        value={playedOn}
                                        onChange={e => setPlayedOn(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                {adding ? 'Adding Score...' : 'Add Score'}
                            </button>
                        </form>
                    </div>

                    {/* Scores List */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-white font-bold text-lg">
                                Current Scores
                            </h2>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${scores.length === 5
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-white/10 text-gray-400'
                                }`}>
                                {scores.length} / 5
                            </span>
                        </div>

                        {scores.length === 0 ? (
                            <div className="text-center py-12">
                                <Target size={48} className="text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No scores yet.</p>
                                <p className="text-gray-500 text-sm">Add your first score above!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {scores.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-blue-500/30 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Rank badge */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
                                                }`}>
                                                {i === 0 ? '★' : `#${i + 1}`}
                                            </div>

                                            {/* Score */}
                                            <div>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-white font-black text-2xl">{s.score}</span>
                                                    <span className="text-gray-400 text-sm mb-0.5">pts</span>
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {new Date(s.played_on).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress bar */}
                        {scores.length > 0 && (
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Score slots used</span>
                                    <span>{scores.length}/5</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                                        style={{ width: `${(scores.length / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}