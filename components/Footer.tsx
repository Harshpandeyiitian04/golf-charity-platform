'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Heart, User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function Footer() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => subscription.unsubscribe()
    }, [])

    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-t from-black to-gray-900 border-t border-white/20 py-12"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="text-green-400" size={24} />
                            <span className="text-lg font-bold text-white">Golf<span className="text-green-400">Gives</span></span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A subscription golf platform combining performance tracking, monthly prize draws, and charitable giving.
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
                            <Heart size={16} className="animate-pulse" />
                            <span>10% minimum to charity — always</span>
                        </div>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/how-it-works" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300 flex items-center gap-1">
                                <span>📈</span> How It Works
                            </Link>
                            <Link href="/charities" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300 flex items-center gap-1">
                                <Heart size={14} /> Charities
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300 flex items-center gap-1">
                                        <User size={14} /> Dashboard
                                    </Link>
                                    <Link href="/scores" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300">
                                        Scores
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/signup" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300">
                                        Subscribe
                                    </Link>
                                    <Link href="/login" className="text-gray-400 hover:text-green-400 text-sm transition-all duration-300">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Our Mission</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every subscription contributes to charity. Play the game you love while making a real difference in the world.
                        </p>
                        <blockquote className="text-green-400 text-sm italic mt-4 border-l-4 border-green-400 pl-4">
                            "Golf is a game that is played on a five-inch course — the distance between your ears." — Bobby Jones
                        </blockquote>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-gray-500 text-sm">© 2026 GolfGives. All rights reserved.</p>
                    <p className="text-gray-500 text-sm">Built with purpose. Powered by passion.</p>
                </motion.div>
            </div>
        </motion.footer>
    )
}