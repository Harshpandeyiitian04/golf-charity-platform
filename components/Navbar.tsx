'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Menu, X, Trophy, Heart, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', session.user.id)
                    .single()
                if (profile?.is_admin) setIsAdmin(true)
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 w-full z-50 bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-lg border-b border-white/20 shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Trophy className="text-green-400 group-hover:text-green-300" size={28} />
                        </motion.div>
                        <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                            Golf<span className="text-green-400">Gives</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link href="/charities" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm flex items-center gap-1">
                                <Heart size={14} />
                                Charities
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link href="/how-it-works" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm flex items-center gap-1">
                                <Target size={14} />
                                How It Works
                            </Link>
                        </motion.div>
                        {user ? (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/dashboard" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm">
                                        Dashboard
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/scores" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm">
                                        Scores
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/draws" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm">
                                        Draws
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/charity" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm">
                                        Charity
                                    </Link>
                                </motion.div>
                                {isAdmin && (
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition-all duration-300 text-sm font-medium bg-yellow-500/10 px-3 py-1 rounded-full">
                                            Admin
                                        </Link>
                                    </motion.div>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="text-sm text-gray-300 hover:text-red-400 transition-all duration-300 bg-red-500/10 px-3 py-1 rounded-full"
                                >
                                    Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-all duration-300">
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href="/signup"
                                        className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black font-semibold text-sm px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                                    >
                                        Get Started
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link href="/charities" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>Charities</Link>
                                <Link href="/how-it-works" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>How It Works</Link>
                                {user ? (
                                    <>
                                        <Link href="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                        <Link href="/scores" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>Scores</Link>
                                        <Link href="/draws" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>Draws</Link>
                                        <Link href="/charity" className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors text-sm" onClick={() => setIsOpen(false)}>Charity</Link>
                                        {isAdmin && <Link href="/admin" className="block px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm" onClick={() => setIsOpen(false)}>Admin</Link>}
                                        <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 transition-colors text-sm">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                                        <Link href="/signup" className="block px-3 py-2 bg-green-500 text-black font-semibold text-sm rounded-full text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}