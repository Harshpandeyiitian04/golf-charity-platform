'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Heart, Search, ExternalLink, Star } from 'lucide-react'

export default function CharitiesPage() {
    const [charities, setCharities] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCharities()
    }, [])

    useEffect(() => {
        if (search.trim() === '') {
            setFiltered(charities)
        } else {
            setFiltered(
                charities.filter(c =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.description?.toLowerCase().includes(search.toLowerCase())
                )
            )
        }
    }, [search, charities])

    const loadCharities = async () => {
        const { data } = await supabase
            .from('charities')
            .select('*')
            .order('is_featured', { ascending: false })
        setCharities(data || [])
        setFiltered(data || [])
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-2 mb-6">
                        <Heart size={14} className="text-pink-400" />
                        <span className="text-pink-400 text-sm font-medium">Making a Difference</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        Our <span className="text-pink-400">Charities</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-10">
                        Every subscription contributes to one of these incredible organisations.
                        Choose the cause closest to your heart.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search charities..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Charities Grid */}
            <section className="pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="text-center text-green-400 animate-pulse py-20">
                            Loading charities...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No charities found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((charity) => (
                                <div
                                    key={charity.id}
                                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all hover:scale-[1.02] group"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {charity.image_url ? (
                                            <img
                                                src={charity.image_url}
                                                alt={charity.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                                <Heart size={48} className="text-pink-400/50" />
                                            </div>
                                        )}
                                        {charity.is_featured && (
                                            <div className="absolute top-3 left-3">
                                                <div className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Star size={10} className="fill-white" />
                                                    Featured
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-white font-bold text-xl mb-2">{charity.name}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                            {charity.description}
                                        </p>
                    {charity.website && (
                        <a
                            href={charity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-pink-400 text-sm hover:text-pink-300 transition-colors"
                        >
                            Visit Website <ExternalLink size={14} />
                        </a>
                    )}
                                </div>
                </div>
                    ))}
                </div>
          )}
        </div>
      </section >

        <Footer />
    </div >
  )
}