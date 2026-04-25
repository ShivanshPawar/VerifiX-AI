import HeroScanner from './HeroScanner'
import FIV from '../../assets/svgs/FIV.svg'
import MMV from '../../assets/svgs/MMV.svg'
import CRV from '../../assets/svgs/CRV.svg'
import SFSV from '../../assets/svgs/SFSV.svg'

const Problem = () => {
    const problems = [
        { title: 'Fake Identity', description: 'Deepfake profiles impersonate real people online', icon: FIV, alt: 'Fake Identity' },
        { title: 'Manipulated Media', description: 'AI-altered images spread misinformation across platforms', icon: MMV, alt: 'Manipulated Media' },
        { title: 'Corporate Risk', description: 'Executives targeted with AI-generated scams and fraud', icon: CRV, alt: 'Corporate Risk' },
        { title: 'Sensitive Face Swaps', description: 'Faces replaced to create harmful misleading content', icon: SFSV, alt: 'Sensitive Face Swaps' },
    ];

    return (
        <section id="problem" className="relative py-10 sm:py-20 px-5 flex justify-center items-center">
            {/* Wrapper for the problem content */}
            <div className='p-5 flex flex-col-reverse lg:flex-row justify-between items-center gap-5 rounded-2xl glass'>

                {/* Problem content */}
                <div className='w-full h-full flex flex-col justify-center items-center gap-5'>

                    {/* Problem */}
                    {/* <h2 className='text-lg px-4 py-1 rounded-lg font-black mt-5 glass'>The Problem</h2> */}

                    {/* Problem heading */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-center">Problems Around Us</h2>

                    {/* Problem description */}
                    <p className='max-w-lg text-center text-(--gray) leading-tight'>Deepfake images are rapidly spreading across the internet, making it harder than ever to verify authenticity and exposing individuals and organizations to serious security risks.</p>

                    {/* Problem cards */}
                    <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 max-w-xl py-5'>
                        {problems.map((problem, index) => (
                            <div key={index} className='w-full rounded-lg flex justify-between items-center p-2 gap-5'>
                                <img src={problem.icon} alt={problem.alt} />
                                <div className='w-full'>
                                    <h3 className='text-md font-semibold'>{problem.title}</h3>
                                    <p className='text-(--gray) text-sm leading-tight'>{problem.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Problem image */}
                <HeroScanner />

            </div>
        </section>
    )
}

export default Problem