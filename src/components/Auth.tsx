import { useState } from 'react'
import { motion } from 'motion/react'
import { supabase } from '../lib/supabase'
import { SwimIcon, BikeIcon, RunIcon } from '../icons'

export function Auth({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const title = 'IRONMAN TRACKER'
  const icons = [SwimIcon, BikeIcon, RunIcon]
  const iconColors = ['text-cyan-400', 'text-amber-400', 'text-emerald-400']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      setError('Check your email to confirm your account, then sign in.')
      setMode('signin')
      return
    }

    onAuth()
  }

  return (
    <div className="min-h-svh bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-mesh" />
      <motion.div
        className="w-full max-w-sm space-y-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight flex justify-center flex-wrap">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <div className="flex justify-center gap-4">
            {icons.map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Icon className={`w-8 h-8 ${iconColors[i]}`} />
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            20-week training plan by Matt Fitzgerald
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors touch-manipulation ${
                mode === 'signin' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >Sign In</button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors touch-manipulation ${
                mode === 'signup' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >Sign Up</button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          {error && (
            <motion.p
              className={`text-sm px-3 py-2 rounded-lg ${
                error.includes('Check your email')
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 active:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors touch-manipulation"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
