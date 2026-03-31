'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'
import { Users, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()
        if (!profile?.is_admin) { router.push('/dashboard'); return }
        loadUsers()
    }

    const loadUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*, charities(name)')
            .order('created_at', { ascending: false })
        setUsers(data || [])
        setLoading(false)
    }

    const toggleSubscription = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        const { error } = await supabase
            .from('profiles')
            .update({ subscription_status: newStatus })
            .eq('id', userId)
        if (error) { toast.error('Failed to update'); return }
        toast.success(`Subscription set to ${newStatus}`)
        loadUsers()
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-yellow-400 animate-pulse">Loading users...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="pt-8 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Users size={28} className="text-blue-400" />
                            <h1 className="text-3xl font-black text-white">User Management</h1>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">User</th>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Plan</th>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Status</th>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Charity</th>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Joined</th>
                                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-t border-white/5 hover:bg-white/3">
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{user.full_name || 'N/A'}</div>
                                                <div className="text-gray-400 text-xs">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-300 capitalize text-sm">
                                                    {user.subscription_plan || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${user.subscription_status === 'active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {user.subscription_status === 'active'
                                                        ? <CheckCircle size={10} />
                                                        : <XCircle size={10} />}
                                                    {user.subscription_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-300 text-sm">
                                                    {user.charities?.name || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-400 text-xs">
                                                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleSubscription(user.id, user.subscription_status)}
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${user.subscription_status === 'active'
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                        }`}
                                                >
                                                    {user.subscription_status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}