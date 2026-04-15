import { Eye, EyeClosed, Undo2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import halfFaceScan from '../assets/images/SideImg.avif';
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useMemo, useState } from 'react';

const SignIn = () => {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const canSubmit = useMemo(() => {
    if (!email.trim()) return false
    if (!password) return false
    return true
  }, [email, password])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const res = await api.post('/auth/login', { email, password }, { skipAuthRedirect: true })
      setUser(res.data?.user ?? null)
      navigate('/scan', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Sign in failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center gap-5 p-5 sm:p-20 lg:p-5'>

      {/* Image */}
      <div className='w-full grid lg:grid-cols-2 gap-5 rounded-2xl glass p-5 max-w-5xl'>
        <div className='w-full relative glass overflow-hidden rounded-2xl'>
          <img className='w-full h-full object-cover' loading='lazy' src={halfFaceScan} alt="halfFaceScan" />
          <div className="absolute inset-0 
              bg-black/90 
              mask-[radial-gradient(circle,transparent_10%,black_100%)]
              pointer-events-none">
          </div>
        </div>

        {/* Form */}
        <div className='sm:py-12'>
          <div className='w-full flex flex-col gap-5'>

            {/* Back button */}
            <div>
              <Link to='/' className='inline-flex items-center gap-3 text-sm text-(--gray) hover:text-white transition-all'>
                <Undo2 className='glass p-1 rounded-full w-8 h-8' />
                Back to home
              </Link>
            </div>

            {/* Form heading */}
            <div className='w-full flex flex-col items-center justify-center'>
              <h1 className='text-3xl font-bold'>Welcome Back to</h1>
              <h1 className='text-3xl font-bold'>Verifi<span className='logo'>X</span></h1>
              <p className='mt-1 text-(--gray) text-center'>Sign in to verify images and detect deepfakes.</p>
            </div>

            {/* Form fields */}
            <form onSubmit={onSubmit} className='space-y-5' action="">

              {/* Email */}
              <div>
                <label className="text-sm text-(--gray)">Email</label>
                <input
                  className='w-full p-3 glass rounded-lg border mt-2'
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='eg.john@gmail.com'
                  autoComplete='email'
                  required
                />
              </div>

              {/* Password */}
              <div className='space-y-1'>
                <label className="text-sm text-(--gray)">Password</label>
                <div className='relative'>
                  <input
                    className='w-full p-3 glass rounded-lg border mt-2'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    autoComplete='new-password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((s) => !s)}
                    className='absolute right-2 top-1/2 -translate-2 text-sm text-(--gray)'
                  >

                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>

                {/* error */}
                {error ? (
                  <p className='text-sm text-(--danger)'>{error}</p>
                ) : null}

              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={!canSubmit || isSubmitting}
                className='w-full p-3 rounded-lg font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 text-lg mt-3 hover:bg-(--primary) transition-all cursor-pointer'

              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Already have an account */}
              <div className="flex justify-center text-sm text-(--gray)">
                Don’t have an account?{' '}
                <Link to="/signup" className="text-(--primary)  hover:underline">
                  Sign up
                </Link>
                .
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
