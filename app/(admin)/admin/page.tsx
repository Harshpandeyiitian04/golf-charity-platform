'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
    Users, Trophy, Heart, CheckCircle,
    BarChart3, ChevronRight, Shield
} from 'lucide-react'

export default function AdminPage() {
    const router = useRouter()
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscribers: 0,
        totalCharityContributions: 0,
        pendingWinners: 0,
        totalDraws: 0,
    })
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

        loadStats()
    }

    const loadStats = async () => {
        const [users, active, winners, draws] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact' }),
            supabase.from('profiles').select('id', { count: 'exact' }).eq('subscription_status', 'active'),
            supabase.from('winners').select('id', { count: 'exact' }).eq('verification_status', 'pending'),
            supabase.from('draws').select('id', { count: 'exact' }),
        ])

        setStats({
            totalUsers: users.count || 0,
            activeSubscribers: active.count || 0,
            totalCharityContributions: (active.count || 0) * 10 * 0.1,
            pendingWinners: winners.count || 0,
            totalDraws: draws.count || 0,
        })

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-yellow-400 animate-pulse">Loading admin panel...</div>
            </div>
        )
    }

    const adminSections = [
        {
            title: 'User Management',
            desc: 'View all users, manage subscriptions and profiles',
            icon: <Users size={24} className="text-blue-400" />,
            href: '/admin/users',
            color: 'border-blue-500/30 hover:bg-blue-500/5',
            stat: `${stats.totalUsers} total users`,
        },
        {
            title: 'Draw Management',
            desc: 'Configure and run monthly draws, publish results',
            icon: <Trophy size={24} className="text-yellow-400" />,
            href: '/admin/draws',
            color: 'border-yellow-500/30 hover:bg-yellow-500/5',
            stat: `${stats.totalDraws} draws run`,
        },
        {
            title: 'Charity Management',
            desc: 'Add, edit and manage charity listings',
            icon: <Heart size={24} className="text-pink-400" />,
            href: '/admin/charities',
            color: 'border-pink-500/30 hover:bg-pink-500/5',
            stat: 'Manage listings',
        },
        {
            title: 'Winners Management',
            desc: 'Verify winner submissions and manage payouts',
            icon: <CheckCircle size={24} className="text-green-400" />,
            href: '/admin/winners',
            color: 'border-green-500/30 hover:bg-green-500/5',
            stat: `${stats.pendingWinners} pending verification`,
        },
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <Shield size={32} className="text-yellow-400" />
                        <div>
                            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
                            <p className="text-gray-400">Full platform control and management</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-400' },
                            { label: 'Active Subscribers', value: stats.activeSubscribers, color: 'text-green-400' },
                            { label: 'Charity Raised (£)', value: `£${stats.totalCharityContributions.toFixed(0)}`, color: 'text-pink-400' },
                            { label: 'Pending Verifications', value: stats.pendingWinners, color: 'text-yellow-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                                <div className="text-gray-400 text-xs">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Admin Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {adminSections.map((section) => (
                            <Link
                                key={section.href}
                                href={section.href}
                                className={`bg-white/5 border ${section.color} rounded-3xl p-6 flex items-center gap-5 transition-all hover:scale-[1.01]`}
                            >
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    {section.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">{section.title}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{section.desc}</p>
                                    <span className="text-xs text-gray-500">{section.stat}</span>
                                </div>
                                <ChevronRight size={20} className="text-gray-500" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}