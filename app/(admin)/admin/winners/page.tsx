'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Trophy, ArrowLeft, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminWinnersPage() {
    const router = useRouter()
    const [winners, setWinners] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: profile } = await supabase
            .from('profiles').select('is_admin').eq('id', session.user.id).single()
        if (!profile?.is_admin) { router.push('/dashboard'); return }
        loadWinners()
    }

    const loadWinners = async () => {
        const { data } = await supabase
            .from('winners')
            .select('*, draws(month, drawn_numbers), profiles(full_name, email)')
            .order('created_at', { ascending: false })
        setWinners(data || [])
        setLoading(false)
    }

    const updateVerification = async (id: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('winners')
            .update({ verification_status: status })
            .eq('id', id)
        if (error) { toast.error('Failed to update'); return }
        toast.success(`Winner ${status}!`)
        loadWinners()
    }

    const markPaid = async (id: string) => {
        const { error } = await supabase
            .from('winners')
            .update({ payment_status: 'paid' })
            .eq('id', id)
        if (error) { toast.error('Failed to update'); return }
        toast.success('Marked as paid!')
        loadWinners()
    }

    const filtered = filter === 'all'
        ? winners
        : winners.filter(w => w.verification_status === filter)

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-yellow-400 animate-pulse">Loading winners...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="pt-8 pb-16 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Trophy size={28} className="text-green-400" />
                            <h1 className="text-3xl font-black text-white">Winners Management</h1>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f
                                        ? 'bg-green-500 text-black'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {f} {f === 'all' ? `(${winners.length})` : `(${winners.filter(w => w.verification_status === f).length})`}
                            </button>
                        ))}
                    </div>

        {/* Winners List */}
        {filtered.length === 0 ? (
            <div className="text-center py-20">
                <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No winners found.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {filtered.map((winner) => (
                    <div
                        key={winner.id}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            {/* Winner Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${winner.match_type === '5-match'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : winner.match_type === '4-match'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {winner.match_type?.toUpperCase()}
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        £{Number(winner.prize_amount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="text-white font-medium">
                                    {winner.profiles?.full_name || 'Unknown User'}
                                </div>
                                <div className="text-gray-400 text-sm">{winner.profiles?.email}</div>
                                <div className="text-gray-500 text-xs mt-1">
                                    Draw: {winner.draws?.month} &nbsp;·&nbsp;
                                    Drawn numbers: {winner.draws?.drawn_numbers?.join(', ')}
                                </div>

                                {/* Proof */}
                                {winner.proof_url ? (
                                    <a
                                        href={winner.proof_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-400 text-xs mt-2 hover:underline"
                                    >
                                        View Proof Screenshot →
                                    </a>
                                ) : (
                                    <span className="text-gray-600 text-xs mt-2 block">No proof uploaded yet</span>
                                )}
                            </div>

                            {/* Status & Actions */}
                            <div className="flex flex-col gap-3 min-w-[180px]">

                                {/* Verification Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-xs">Verification:</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${winner.verification_status === 'approved'
                                            ? 'bg-green-500/20 text-green-400'
                                            : winner.verification_status === 'rejected'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {winner.verification_status}
                                    </span>
                                </div>

                                {/* Payment Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-xs">Payment:</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${winner.payment_status === 'paid'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-orange-500/20 text-orange-400'
                                    }`}>
                                        {winner.payment_status}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    {winner.verification_status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateVerification(winner.id, 'approved')}
                                                className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-500/30 transition-all"
                                            >
                                                <CheckCircle size={12} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateVerification(winner.id, 'rejected')}
                                                className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-500/30 transition-all"
                                            >
                                                <XCircle size={12} />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {winner.verification_status === 'approved' && winner.payment_status === 'pending' && (
                                        <button
                                            onClick={() => markPaid(winner.id)}
                                            className="flex items-center justify-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-500/30 transition-all"
                                        >
                                            <DollarSign size={12} />
                                            Mark as Paid
                                        </button>
                                    )}

                                    {winner.verification_status === 'approved' && winner.payment_status === 'paid' && (
                                        <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                                            <CheckCircle size={12} />
                                            Paid & Complete
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

            </div>
        </div>
    </div >
  )
}