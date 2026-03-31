import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
    Trophy, Heart, Target, Zap,
    CheckCircle, ChevronRight, Star,
    Shield, BarChart3
} from 'lucide-react'

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        How <span className="text-green-400">GolfGives</span> Works
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Everything you need to know about playing, winning, and giving.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="pb-24 px-4">
                <div className="max-w-4xl mx-auto space-y-6">

                    {[
                        {
                            number: '01',
                            icon: <Shield size={28} className="text-green-400" />,
                            title: 'Subscribe to GolfGives',
                            color: 'border-green-500/30 bg-green-500/5',
                            points: [
                                'Choose a Monthly (£10) or Yearly (£96) plan',
                                'Pay securely via Stripe — cancel anytime',
                                'A minimum 10% of your subscription goes to your chosen charity',
                                'You can increase your charity contribution at any time',
                            ],
                        },
                        {
                            number: '02',
                            icon: <Target size={28} className="text-blue-400" />,
                            title: 'Enter Your Golf Scores',
                            color: 'border-blue-500/30 bg-blue-500/5',
                            points: [
                                'Log your Stableford scores — must be between 1 and 45',
                                'Each score must include the date it was played',
                                'Only your 5 most recent scores are kept at any time',
                                'Adding a 6th score automatically removes the oldest',
                                'Your 5 scores become your draw numbers each month',
                            ],
                        },
                        {
                            number: '03',
                            icon: <Heart size={28} className="text-pink-400" />,
                            title: 'Choose Your Charity',
                            color: 'border-pink-500/30 bg-pink-500/5',
                            points: [
                                'Browse our directory of verified charities',
                                'Select the cause that matters most to you',
                                'Set your contribution percentage (minimum 10%)',
                                'You can change your charity selection at any time',
                                'Make an independent donation anytime from your dashboard',
                            ],
                        },
                        {
                            number: '04',
                            icon: <Zap size={28} className="text-yellow-400" />,
                            title: 'Monthly Draw',
                            color: 'border-yellow-500/30 bg-yellow-500/5',
                            points: [
                                'A draw is run once per month by our admin team',
                                'Five numbers between 1–45 are drawn (random or algorithmic)',
                                'Your 5 scores are checked against the drawn numbers',
                                'Match 3, 4, or all 5 numbers to win a prize',
                                'Draws are published on the platform for full transparency',
                            ],
                        },
                        {
                            number: '05',
                            icon: <Trophy size={28} className="text-orange-400" />,
                            title: 'Prize Pool & Winnings',
                            color: 'border-orange-500/30 bg-orange-500/5',
                            points: [
                                '60% of all subscription revenue goes into the prize pool',
                                '5-Number Match wins 40% of the pool (Jackpot — rolls over!)',
                                '4-Number Match wins 35% of the pool',
                                '3-Number Match wins 25% of the pool',
                                'If multiple winners share a tier, the prize is split equally',
                                'The jackpot carries forward to next month if unclaimed',
                            ],
                        },
                        {
                            number: '06',
                            icon: <CheckCircle size={28} className="text-purple-400" />,
                            title: 'Winner Verification & Payout',
                            color: 'border-purple-500/30 bg-purple-500/5',
                            points: [
                                'Winners are notified via email automatically',
                                'Upload a screenshot of your scores as proof',
                                'Our admin team reviews and approves your submission',
                                'Once verified, your prize is paid out to you',
                                'Track your payment status from your dashboard',
                            ],
                        },
                    ].map((step) => (
                        <div
                            key={step.number}
                            className={`border ${step.color} rounded-3xl p-8`}
                        >
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-gray-500 text-sm font-bold">STEP {step.number}</span>
                                        <h3 className="text-white font-black text-xl">{step.title}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {step.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                                <ChevronRight size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Prize Table */}
            <section className="pb-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-white text-center mb-10">
                        Prize Pool <span className="text-green-400">Breakdown</span>
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-3 bg-white/5 px-6 py-3">
                            <span className="text-gray-400 text-sm font-semibold">Match Type</span>
                            <span className="text-gray-400 text-sm font-semibold text-center">Pool Share</span>
                            <span className="text-gray-400 text-sm font-semibold text-right">Rollover?</span>
                        </div>
                        {[
                            { match: '5 Numbers', share: '40%', rollover: '✅ Yes (Jackpot)', color: 'text-yellow-400' },
                            { match: '4 Numbers', share: '35%', rollover: '❌ No', color: 'text-green-400' },
                            { match: '3 Numbers', share: '25%', rollover: '❌ No', color: 'text-blue-400' },
                        ].map((row) => (
                            <div key={row.match} className="grid grid-cols-3 px-6 py-4 border-t border-white/10">
                                <span className={`font-bold ${row.color}`}>{row.match}</span>
                                <span className="text-white font-black text-center">{row.share}</span>
                                <span className="text-gray-400 text-sm text-right">{row.rollover}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-24 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black text-white mb-4">
                        Ready to <span className="text-green-400">Get Started?</span>
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Join today and make every round of golf count.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black text-lg px-10 py-4 rounded-full transition-all hover:scale-105"
                    >
                        Subscribe Now <ChevronRight size={22} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}