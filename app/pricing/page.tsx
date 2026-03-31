'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Check, Trophy, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PricingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getUser()

        if (searchParams.get('cancelled')) {
            toast.error('Subscription cancelled — no charge made.')
        }
    }, [])

    const handleSubscribe = async (plan: string) => {
        if (!user) {
            router.push('/signup')
            return
        }

        setLoading(plan)

        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan,
                userId: user.id,
                email: user.email,
            }),
        })

        const data = await res.json()

        if (data.error) {
            toast.error(data.error)
            setLoading(null)
            return
        }

        window.location.href = data.url
    }

    const features = [
        'Enter your 5 Stableford scores monthly',
        'Participate in monthly prize draws',
        'Win from 3 prize tiers',
        'Jackpot rolls over if unclaimed',
        'Choose your charity recipient',
        'Full dashboard & score history',
        'Winner verification & payout',
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <div className="pt-32 pb-24 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Simple{' '}
                            <span className="text-green-400">Pricing</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            One platform. Two plans. Unlimited impact.
                            Cancel anytime — no questions asked.
                        </p>
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">

                        {/* Monthly Plan */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap size={20} className="text-green-400" />
                                    <span className="text-white font-bold text-lg">Monthly</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-white">£10</span>
                                    <span className="text-gray-400 mb-2">/month</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-2">
                                    Perfect for casual golfers who want to get started.
                                </p>
                            </div>

                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                {features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe('monthly')}
                                disabled={loading === 'monthly'}
                                className="w-full bg-white/10 hover:bg-green-500 hover:text-black border border-white/20 hover:border-green-500 text-white font-bold py-4 rounded-xl transition-all"
                            >
                                {loading === 'monthly' ? 'Redirecting...' : 'Subscribe Monthly'}
                            </button>
                        </div>

                        {/* Yearly Plan */}
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/40 rounded-3xl p-8 flex flex-col relative">
                            {/* Best Value Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className="bg-green-500 text-black text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1">
                                    <Trophy size={12} />
                                    BEST VALUE — SAVE 20%
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Trophy size={20} className="text-green-400" />
                                    <span className="text-white font-bold text-lg">Yearly</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-white">£96</span>
                                    <span className="text-gray-400 mb-2">/year</span>
                                </div>
                                <p className="text-green-400 text-sm mt-2 font-medium">
                                    That's just £8/month — save £24 a year!
                                </p>
                            </div>

                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                {features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                                <li className="flex items-start gap-3 text-sm text-green-300 font-medium">
                                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    Priority winner verification
                                </li>
                            </ul>

                            <button
                                onClick={() => handleSubscribe('yearly')}
                                disabled={loading === 'yearly'}
                                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all"
                            >
                                {loading === 'yearly' ? 'Redirecting...' : 'Subscribe Yearly'}
                            </button>
                        </div>
                    </div>

                    {/* Bottom note */}
                    <div className="text-center text-gray-500 text-sm">
                        <p>All plans include a minimum 10% charity contribution.</p>
                        <p className="mt-1">
                            Already have an account?{' '}
                            <Link href="/login" className="text-green-400 hover:text-green-300">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}