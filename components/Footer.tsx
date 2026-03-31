import Link from 'next/link'
import { Trophy, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="text-green-400" size={22} />
                            <span className="text-lg font-bold">Golf<span className="text-green-400">Gives</span></span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A subscription golf platform combining performance tracking, monthly prize draws, and charitable giving.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/how-it-works" className="text-gray-400 hover:text-green-400 text-sm transition-colors">How It Works</Link>
                            <Link href="/charities" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Charities</Link>
                            <Link href="/signup" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Subscribe</Link>
                            <Link href="/login" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Login</Link>
                        </div>
                    </div>

                    {/* Mission */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Our Mission</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every subscription contributes to charity. Play the game you love while making a real difference in the world.
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
                            <Heart size={16} />
                            <span>10% minimum to charity — always</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 GolfGives. All rights reserved.</p>
                    <p className="text-gray-500 text-sm">Built with purpose. Powered by passion.</p>
                </div>
            </div>
        </footer>
    )
}