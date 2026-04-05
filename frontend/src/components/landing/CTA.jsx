import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section id="cta" className="py-20 px-6">

      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center text-center rounded-2xl p-8 sm:p-12 glass">

        <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">
          Ready to Verify Your First Image?
        </h2>

        <p className="text-(--gray) max-w-2xl mx-auto">
          Upload an image and let VerifiX analyze it using advanced AI deepfake detection.
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