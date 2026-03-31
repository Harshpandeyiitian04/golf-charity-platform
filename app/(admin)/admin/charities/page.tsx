'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Heart, ArrowLeft, Plus, Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCharitiesPage() {
    const router = useRouter()
    const [charities, setCharities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '', description: '', image_url: '', website: '', is_featured: false
    })

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: profile } = await supabase
            .from('profiles').select('is_admin').eq('id', session.user.id).single()
        if (!profile?.is_admin) { router.push('/dashboard'); return }
        loadCharities()
    }

    const loadCharities = async () => {
        const { data } = await supabase
            .from('charities').select('*').order('created_at', { ascending: false })
        setCharities(data || [])
        setLoading(false)
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name) { toast.error('Name is required'); return }
        setAdding(true)
        const { error } = await supabase.from('charities').insert(form)
        if (error) { toast.error(error.message); setAdding(false); return }
        toast.success('Charity added!')
        setForm({ name: '', description: '', image_url: '', website: '', is_featured: false })
        setShowForm(false)
        loadCharities()
        setAdding(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this charity?')) return
        const { error } = await supabase.from('charities').delete().eq('id', id)
        if (error) { toast.error(error.message); return }
        toast.success('Charity deleted')
        loadCharities()
    }

    const toggleFeatured = async (id: string, current: boolean) => {
        await supabase.from('charities').update({ is_featured: !current }).eq('id', id)
        loadCharities()
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-yellow-400 animate-pulse">Loading...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="pt-8 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-gray-400 hover:text-white">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="flex items-center gap-3">
                                <Heart size={28} className="text-pink-400" />
                                <h1 className="text-3xl font-black text-white">Charity Management</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold px-4 py-2 rounded-xl transition-all"
                        >
                            <Plus size={18} />
                            Add Charity
                        </button>
                    </div>

                    {/* Add Form */}
                    {showForm && (
                        <div className="bg-white/5 border border-pink-500/30 rounded-3xl p-6 mb-8">
                            <h2 className="text-white font-bold text-lg mb-5">Add New Charity</h2>
                            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Name *</label>
                                    <input
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                                        placeholder="Charity name"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Website</label>
                                    <input
                                        value={form.website}
                                        onChange={e => setForm({ ...form, website: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Image URL</label>
                                    <input
                                        value={form.image_url}
                                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                                        placeholder="https://image-url.jpg"
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={form.is_featured}
                                        onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                                        className="w-4 h-4 accent-pink-500"
                                    />
                                    <label htmlFor="featured" className="text-gray-300 text-sm">Mark as Featured</label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-400 mb-2 block">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 resize-none"
                                        placeholder="Describe what this charity does..."
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={adding}
                                        className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-6 py-3 rounded-xl transition-all"
                                    >
                                        {adding ? 'Adding...' : 'Add Charity'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-white/10 text-gray-300 font-bold px-6 py-3 rounded-xl transition-all hover:bg-white/20"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Charities List */}
                    <div className="space-y-4">
                        {charities.map((charity) => (
                            <div key={charity.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                                {charity.image_url && (
                                    <img src={charity.image_url} alt={charity.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-bold">{charity.name}</h3>
                                        {charity.is_featured && (
                                            <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full">Featured</span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-1">{charity.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleFeatured(charity.id, charity.is_featured)}
                                        className={`p-2 rounded-lg transition-all ${charity.is_featured
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'
                                            }`}
                                    >
                                        <Star size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(charity.id)}
                                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}