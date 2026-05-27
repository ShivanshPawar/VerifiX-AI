import { useMemo, useState } from 'react'
import { Eye, EyeClosed, Undo2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import halfFaceScan from '../assets/images/SideImg.avif';
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'


const SignUp = () => {

  const { refreshUser } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const canSubmit = useMemo(() => {
    if (!firstName.trim()) return false
    if (!lastName.trim()) return false
    if (!email.trim()) return false
    if (password.length < 6) return false
    return true
  }, [firstName, lastName, email, password])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await api.post('/auth/register', {
        email,
        fullName: { firstName: firstName.trim(), lastName: lastName.trim() },
        password,
      })
      // Refresh user from server session (authenticated via httpOnly cookie)
      const user = await refreshUser()

      if (!user) {
        throw new Error('Account created, but the session cookie was not accepted. Please sign in.')
      }

      navigate('/scan', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Sign up failed. Please try again.'
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
        <div className='sm:py-5'>
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
              <h1 className='text-3xl font-bold'>Create an account</h1>
              <p className='mt-1 text-(--gray) text-center'>Join VerifiX to detect deepfake images instantly.</p>
            </div>

            {/* Form fields */}
            <form onSubmit={onSubmit} className='space-y-5' action="">

              {/* Full name */}
              <div className='space-y-2'>
                <label className="text-sm text-(--gray)">Full Name</label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2'>
                  <input
                    className='w-full p-3 glass rounded-lg border'
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    autoComplete='given-name'
                    required
                  />

                  <input
                    type="text"
                    className='w-full p-3 glass rounded-lg border'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Last name'
                    autoComplete='family-name'
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
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
                    placeholder='At least 6 characters'
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
                className='w-full p-3 rounded-lg font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 text-lg hover:bg-(--primary) transition-all cursor-pointer '

              >
                {isSubmitting ? 'Creating…' : 'Create account'}
              </button>

              {/* Already have an account */}
              <div className="flex justify-center text-sm text-(--gray)">
                Already have an account?{' '}
                <Link to="/signin" className="text-(--primary)  hover:underline">
                  Sign in
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

export default SignUp
