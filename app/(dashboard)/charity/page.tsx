'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Heart, CheckCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function CharityPage() {
  const router = useRouter()
  const [charities, setCharities] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null)
  const [percentage, setPercentage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState('10')
  const [donating, setDonating] = useState(false)

  const handleDonate = async () => {
    if (!selectedCharity) { toast.error('Select a charity first'); return }
    setDonating(true)
    const charityName = charities.find(c => c.id === selectedCharity)?.name || 'Charity'
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(donationAmount), charityName, email: session?.user?.email }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { toast.error('Failed to create donation'); setDonating(false) }
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    setUserId(session.user.id)

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    setProfile(profileData)
    setSelectedCharity(profileData?.charity_id || null)
    setPercentage(profileData?.charity_percentage || 10)

    // Load charities
    const { data: charitiesData } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })

    setCharities(charitiesData || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!selectedCharity) {
      toast.error('Please select a charity first')
      return
    }

    if (percentage < 10 || percentage > 100) {
      toast.error('Contribution must be between 10% and 100%')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        charity_id: selectedCharity,
        charity_percentage: percentage,
      })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to save: ' + error.message)
      setSaving(false)
      return
    }

    toast.success('Charity preference saved!')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 animate-pulse">Loading charities...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-20 pb-16 px-4"
      >
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart size={28} className="text-pink-400" />
              <h1 className="text-3xl font-black text-white">Choose Your Charity</h1>
            </div>
            <p className="text-gray-400">
              A minimum of 10% of your subscription goes to your chosen charity every month.
            </p>
          </motion.div>

          {/* Current Selection Banner */}
          {profile?.charity_id && (
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
              <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
              <p className="text-pink-300 text-sm">
                You are currently contributing <strong>{profile.charity_percentage}%</strong> to{' '}
                <strong>{charities.find(c => c.id === profile.charity_id)?.name || 'your charity'}</strong>
              </p>
            </div>
          )}

          {/* Charity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {charities.map((charity, index) => (
              <div
                key={charity.id}
                onClick={() => setSelectedCharity(charity.id)}
                className={`relative bg-white/5 border rounded-3xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${selectedCharity === charity.id ? 'border-pink-500/60 bg-pink-500/10' : 'border-white/10 hover:border-white/20'}`}
              >
                {/* Featured badge */}
                {charity.is_featured && (
                  <div className="absolute -top-3 left-4">
                    <div className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  </div>
                )}

                {/* Selected checkmark */}
                {selectedCharity === charity.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle size={22} className="text-pink-400" />
                  </div>
                )}

                {/* Charity Image */}
                {charity.image_url && (
                  <img
                    src={charity.image_url}
                    alt={charity.name}
                    className="w-full h-32 object-cover rounded-2xl mb-4"
                  />
                )}

                <h3 className="text-white font-bold text-lg mb-2">{charity.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {charity.description}
                </p>

                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-green-400 text-xs hover:underline"
                  >
                    Visit website <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Contribution Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6"
          >
            <h2 className="text-white font-bold text-lg mb-2">
              Your Contribution Percentage
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Minimum is 10%. You can choose to give more if you wish.
            </p>

            {/* Slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm">Contribution</span>
                <span className="text-pink-400 font-black text-2xl">{percentage}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={percentage}
                onChange={e => setPercentage(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10% (minimum)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[10, 15, 20, 25, 30].map(p => (
                <button
                  key={p}
                  onClick={() => setPercentage(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${percentage === p
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving || !selectedCharity}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:bg-pink-500/40 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Heart size={20} />
            {saving ? 'Saving...' : 'Save Charity Preference'}
          </motion.button>
          {/* Independent Donation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-3xl p-6"
          >
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <Heart size={18} className="text-pink-400" />
              Make an Independent Donation
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Donate directly to your chosen charity — not tied to gameplay.
            </p>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={e => setDonationAmount(e.target.value)}
                  placeholder="10"
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                />
              </div>
              <button
                onClick={handleDonate}
                disabled={donating || !selectedCharity}
                className="bg-pink-500 hover:bg-pink-400 disabled:bg-pink-500/40 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                {donating ? 'Redirecting...' : 'Donate Now'}
              </button>
            </div>
          </motion.div>

        </div>
      </motion.div>
      <Footer />
    </div>
  )
}