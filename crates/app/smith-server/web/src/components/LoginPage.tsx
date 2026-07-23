import { useState, type FormEvent } from 'react'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sage-paper via-white to-sage-veil p-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-sage-cloud/50 p-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-sage-teal to-mist-wash rounded-2xl flex items-center justify-center text-white text-heading-sm font-bold shadow-md">
            S
          </div>
          <div className="text-center">
            <h1 className="text-heading-sm font-semibold text-graphite">
              Smith Console
            </h1>
            <p className="text-body-sm text-slate mt-1">
              Sign in to your workspace
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-body-sm font-medium text-graphite">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-10 w-full rounded-xl border border-sage-cloud/80 bg-white px-3 py-1.5 text-body-sm text-graphite transition-all outline-none placeholder:text-slate/40 focus-visible:border-sage-teal focus-visible:ring-3 focus-visible:ring-sage-teal/15"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-body-sm font-medium text-graphite">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-10 w-full rounded-xl border border-sage-cloud/80 bg-white px-3 py-1.5 text-body-sm text-graphite transition-all outline-none placeholder:text-slate/40 focus-visible:border-sage-teal focus-visible:ring-3 focus-visible:ring-sage-teal/15"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-10 w-full rounded-xl bg-gradient-to-r from-sage-teal to-mist-wash text-white text-body-sm font-medium transition-all duration-200 hover:shadow-md hover:brightness-105 active:scale-[0.98] cursor-pointer border-none"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
