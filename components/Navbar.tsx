'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Menu, X, Trophy } from 'lucide-react'

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
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Trophy className="text-green-400" size={24} />
                        <span className="text-xl font-bold text-white">Golf<span className="text-green-400">Gives</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/charities" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                            Charities
                        </Link>
                        <Link href="/how-it-works" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                            How It Works
                        </Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                                    Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-gray-300 hover:text-red-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 flex flex-col gap-4">
                        <Link href="/charities" className="text-gray-300 hover:text-green-400 text-sm" onClick={() => setIsOpen(false)}>Charities</Link>
                        <Link href="/how-it-works" className="text-gray-300 hover:text-green-400 text-sm" onClick={() => setIsOpen(false)}>How It Works</Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-300 hover:text-green-400 text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                {isAdmin && (
                                    <Link href="/admin" className="text-yellow-400 text-sm" onClick={() => setIsOpen(false)}>Admin</Link>
                                )}
                                <button onClick={handleLogout} className="text-left text-red-400 text-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-300 text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link href="/signup" className="bg-green-500 text-black font-semibold text-sm px-4 py-2 rounded-full w-fit" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}