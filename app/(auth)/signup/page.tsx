'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Eye, EyeOff, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [charities, setCharities] = useState<any[]>([])
  const [selectedCharity, setSelectedCharity] = useState<string>('')
  const [donationAmount, setDonationAmount] = useState('10')
  const [donating, setDonating] = useState(false)

  useEffect(() => {
    supabase.from('charities').select('id, name').then(({ data }) => {
      setCharities(data || [])
      if (data && data.length > 0) setSelectedCharity(data[0].id)
    })
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          charity_id: selectedCharity || null,
          charity_percentage: 10,
          subscription_status: 'inactive',
          is_admin: false,
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('Profile error:', profileError)
      }

      toast.success('Account created!')
      setTimeout(() => router.push('/dashboard'), 1000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Trophy className="text-green-400" size={28} />
            <span className="text-2xl font-black text-white">Golf<span className="text-green-400">Gives</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">Start playing, winning and giving today</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-5">

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="John Smith"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Charity Selection at Signup */}
            {charities.length > 0 && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                  <Heart size={14} className="text-pink-400" />
                  Choose Your Charity
                </label>
                <select
                  value={selectedCharity}
                  onChange={e => setSelectedCharity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                >
                  {charities.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">
                  Minimum 10% of your subscription goes to this charity
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-bold py-4 rounded-xl transition-all mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}