'use client'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Trophy, Heart, Target,
  TrendingUp, CheckCircle, XCircle, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [charity, setCharity] = useState<any>(null)
  const [wins, setWins] = useState<any[]>([])
  const [draws, setDraws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('🎉 Subscription activated! Welcome to GolfGives!')
    }
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const userId = session.user.id

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(profileData)

    const { data: scoresData } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('played_on', { ascending: false })
    setScores(scoresData || [])

    if (profileData?.charity_id) {
      const { data: charityData } = await supabase
        .from('charities')
        .select('*')
        .eq('id', profileData.charity_id)
        .single()
      setCharity(charityData)
    }

    const { data: winsData } = await supabase
      .from('winners')
      .select('*, draws(month)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setWins(winsData || [])

    const { data: drawsData } = await supabase
      .from('draw_entries')
      .select('*, draws(month, status, drawn_numbers)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
    setDraws(drawsData || [])

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 text-lg animate-pulse">Loading your dashboard...</div>
      </div>
    )
  }

  const totalWon = wins.reduce((sum, w) => sum + (w.prize_amount || 0), 0)
  const isActive = profile?.subscription_status === 'active'

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Welcome back, <span className="text-green-400">{profile?.full_name?.split(' ')[0] || 'Golfer'}</span> 👋
            </h1>
            <p className="text-gray-400 mt-2">Here's your GolfGives overview</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-1">Scores Logged</div>
              <div className="text-2xl font-black text-white">{scores.length}<span className="text-gray-500 text-sm">/5</span></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-1">Draws Entered</div>
              <div className="text-2xl font-black text-white">{draws.length}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-1">Total Won</div>
              <div className="text-2xl font-black text-green-400">£{totalWon.toFixed(0)}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-1">Charity %</div>
              <div className="text-2xl font-black text-pink-400">{profile?.charity_percentage || 10}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Subscription */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-green-400" />
                <h2 className="text-white font-bold text-lg">Subscription</h2>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${
                isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {isActive ? 'Active' : 'Inactive'}
              </div>
              {isActive ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan</span>
                    <span className="text-white capitalize">{profile?.subscription_plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Renews</span>
                    <span className="text-white">
                      {profile?.subscription_end_date
                        ? new Date(profile.subscription_end_date).toLocaleDateString('en-GB')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-4">Subscribe to enter monthly draws and win prizes.</p>
                  <Link href="/pricing" className="inline-flex items-center gap-2 bg-green-500 text-black font-bold px-4 py-2 rounded-xl text-sm">
                    Subscribe Now <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Charity */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={20} className="text-pink-400" />
                <h2 className="text-white font-bold text-lg">Your Charity</h2>
              </div>
              {charity ? (
                <div>
                  <div className="text-white font-semibold mb-1">{charity.name}</div>
                  <div className="text-gray-400 text-sm mb-4 line-clamp-2">{charity.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-bold text-lg">{profile?.charity_percentage}% contribution</span>
                    <Link href="/charity" className="text-green-400 text-sm hover:underline">Change</Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-4">You haven't selected a charity yet.</p>
                  <Link href="/charity" className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 border border-pink-500/30 font-bold px-4 py-2 rounded-xl text-sm">
                    Choose Charity <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Scores */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-blue-400" />
                  <h2 className="text-white font-bold text-lg">My Scores</h2>
                </div>
                <Link href="/scores" className="text-green-400 text-sm hover:underline flex items-center gap-1">
                  Manage <ChevronRight size={14} />
                </Link>
              </div>
              {scores.length > 0 ? (
                <div className="space-y-2">
                  {scores.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs">#{i + 1}</span>
                        <span className="text-white font-bold text-lg">{s.score}</span>
                        <span className="text-gray-400 text-xs">pts</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(s.played_on).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-4">No scores logged yet.</p>
                  <Link href="/scores" className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-4 py-2 rounded-xl text-sm">
                    Add Score <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Draws & Winnings */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={20} className="text-yellow-400" />
                <h2 className="text-white font-bold text-lg">Draws & Winnings</h2>
              </div>
              {wins.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {wins.slice(0, 3).map((w) => (
                    <div key={w.id} className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2">
                      <div>
                        <div className="text-yellow-400 font-semibold text-sm">{w.match_type}</div>
                        <div className="text-gray-400 text-xs">{w.draws?.month}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">£{w.prize_amount}</div>
                        <div className={`text-xs ${w.payment_status === 'paid' ? 'text-green-400' : 'text-orange-400'}`}>
                          {w.payment_status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-4">No winnings yet — keep playing!</p>
              )}
              <div className="flex items-center justify-between text-sm border-t border-white/10 pt-4">
                <span className="text-gray-400">Draws entered</span>
                <span className="text-white font-bold">{draws.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Total won</span>
                <span className="text-green-400 font-bold">£{totalWon.toFixed(2)}</span>
              </div>
              <Link href="/draws" className="inline-flex items-center gap-1 text-yellow-400 text-sm mt-3 hover:underline">
                View all draws <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 text-lg animate-pulse">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}