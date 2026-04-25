import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section id="cta" className="flex justify-center items-center py-10 sm:py-30 px-5 sm:px-10 lg:px-0">

      <div className=" flex flex-col justify-center items-center text-center rounded-2xl py-10 px-5 sm:p-12 glass">

        <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">
          Stop Guessing. Start Verifying.
        </h2>

        <p className="text-(--gray) max-w-2xl mx-auto">
          Make confident decisions with AI-powered deepfake detection. VerifiX helps you uncover manipulated images instantly—securely, privately, and with precision you can trust.
        </p>

        <div className='mt-10 p-2 rounded-xl glass flex items-center'>
          <Link to="/signup" className='bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 text-(--white) py-2 px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-(--primary) transition-all'>
            Get Started
          </Link>
          <Link to="/scan" className='py-2 px-4 rounded-xl font-semibold text-sm text-(--gray) hover:text-(--white) sm:text-base'>
            Test-Scan
          </Link>
        </div>

      </div>

    </section>
  )
}

export default CTA