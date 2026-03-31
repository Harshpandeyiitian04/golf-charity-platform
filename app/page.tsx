'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Trophy, Heart, Zap, Shield, ChevronRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-8">
            <Heart size={14} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">Golf meets Charity — Every Month</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Play Golf.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Win Big.
            </span>
            <br />
            Change Lives.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe, enter your Stableford scores, and enter monthly prize draws —
            while automatically supporting the charity you care about most.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Playing & Giving
              <ChevronRight size={20} />
            </Link>
            <Link
              href="/how-it-works"
              className="border border-white/20 hover:border-green-500/50 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all hover:bg-white/5 flex items-center justify-center gap-2"
            >
              How It Works
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-green-400">£10K+</div>
              <div className="text-gray-400 text-xs mt-1">Prize Pool Monthly</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-green-400">10%+</div>
              <div className="text-gray-400 text-xs mt-1">Goes to Charity</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-green-400">4</div>
              <div className="text-gray-400 text-xs mt-1">Charities Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Simple as{' '}
              <span className="text-green-400">1, 2, 3</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No complexity. Just golf, prizes, and purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Shield size={32} className="text-green-400" />,
                title: 'Subscribe',
                desc: 'Choose a monthly or yearly plan. A portion of every subscription goes straight to your chosen charity.',
              },
              {
                step: '02',
                icon: <Zap size={32} className="text-green-400" />,
                title: 'Enter Your Scores',
                desc: 'Log your latest 5 Stableford scores (1–45). These become your draw numbers each month.',
              },
              {
                step: '03',
                icon: <Trophy size={32} className="text-green-400" />,
                title: 'Win & Give',
                desc: 'Match 3, 4, or all 5 drawn numbers to win your share of the prize pool — jackpot rolls over!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all hover:bg-white/8"
              >
                <div className="text-6xl font-black text-white/5 absolute top-6 right-6">
                  {item.step}
                </div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZE POOL SECTION */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              This Month's{' '}
              <span className="text-green-400">Prize Pool</span>
            </h2>
            <p className="text-gray-400 text-lg">Three ways to win every single month</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                match: '5 Number Match',
                share: '40%',
                label: 'JACKPOT',
                color: 'from-yellow-500/20 to-orange-500/10',
                border: 'border-yellow-500/30',
                textColor: 'text-yellow-400',
                note: 'Rolls over if unclaimed!',
              },
              {
                match: '4 Number Match',
                share: '35%',
                label: 'SECOND PRIZE',
                color: 'from-green-500/20 to-emerald-500/10',
                border: 'border-green-500/30',
                textColor: 'text-green-400',
                note: 'Split equally among winners',
              },
              {
                match: '3 Number Match',
                share: '25%',
                label: 'THIRD PRIZE',
                color: 'from-blue-500/20 to-cyan-500/10',
                border: 'border-blue-500/30',
                textColor: 'text-blue-400',
                note: 'Split equally among winners',
              },
            ].map((prize) => (
              <div
                key={prize.match}
                className={`bg-gradient-to-br ${prize.color} border ${prize.border} rounded-3xl p-8 text-center`}
              >
                <div className={`text-xs font-bold tracking-widest ${prize.textColor} mb-3`}>
                  {prize.label}
                </div>
                <div className={`text-5xl font-black ${prize.textColor} mb-2`}>
                  {prize.share}
                </div>
                <div className="text-white font-semibold mb-2">{prize.match}</div>
                <div className="text-gray-400 text-sm">{prize.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CHARITY SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-2 mb-6">
              <Heart size={14} className="text-pink-400" />
              <span className="text-pink-400 text-sm font-medium">Spotlight Charity</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your Game,{' '}
              <span className="text-pink-400">Their Future</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Every subscription automatically contributes to the charity you choose. Real impact, every month.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Featured This Month</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Children in Need</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Supporting disadvantaged children across the UK with life-changing projects.
                Your golf subscription directly funds programmes that transform young lives.
              </p>
              <Link
                href="/charities"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-semibold px-6 py-3 rounded-full transition-all"
              >
                <Heart size={16} />
                View All Charities
              </Link>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-pink-400">£2.4K</div>
                <div className="text-gray-400 text-xs mt-1">Raised This Month</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-pink-400">143</div>
                <div className="text-gray-400 text-xs mt-1">Contributors</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center col-span-2">
                <div className="text-3xl font-black text-pink-400">£18.7K</div>
                <div className="text-gray-400 text-xs mt-1">Total Raised All Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to Make Your{' '}
            <span className="text-green-400">Game Count?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join hundreds of golfers who play, win, and give — every single month.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black text-xl px-10 py-5 rounded-full transition-all hover:scale-105"
          >
            Subscribe Now
            <ChevronRight size={24} />
          </Link>
          <p className="text-gray-500 text-sm mt-4">Cancel anytime. Minimum 10% always goes to charity.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}