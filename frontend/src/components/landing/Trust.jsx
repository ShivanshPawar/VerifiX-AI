import { BadgeCheck, Eye, LockKeyhole, Radar, ShieldCheck } from 'lucide-react'

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Cross-model validation',
    description:
      'Each scan compares multiple forensic signals before a result is shown, reducing overconfidence from a single detection path.',
  },
  {
    icon: Radar,
    title: 'Forensic pattern review',
    description:
      'Lighting shifts, texture artifacts, identity mismatches, and generation traces are evaluated together for a fuller authenticity check.',
  },
  {
    icon: LockKeyhole,
    title: 'Privacy-first workflow',
    description:
      'Images are analyzed inside a secure flow designed to protect sensitive content while still delivering a clear verdict fast.',
  },
]

const proofPoints = [
  { value: '3-layer', label: 'analysis flow' },
  { value: 'Multi-model', label: 'signal matching' },
  { value: 'Clear', label: 'decision output' },
]

const Trust = () => {
  return (
    <section
      id="trust"
      className="flex justify-center px-5 py-20 sm:px-10 lg:px-0"
    >
      <div className="w-full max-w-300 lg:w-[80%]">
        <div>
          <div className="grid gap-10 lg:gap-30 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="glass inline-flex tracking-[0.18em] items-center gap-2 rounded-full px-4 py-2 text-sm text-(--white)">
                <span>Why trust VerifiX</span>
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-bold sm:text-4xl">
                Built to verify images with evidence, not just confidence.
              </h2>

              <p className="mt-4 max-w-2xl text-(--gray) sm:text-base">
                VerifiX follows a forensic-first design style across the product:
                layered detection, readable results, and a secure scan flow that
                helps people act on evidence instead of guesswork.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {proofPoints.map((point) => (
                  <div
                    key={point.label}
                    className="glass rounded-2xl px-4 py-4 hover:scale-102 transition-all"
                  >
                    <div className="text-lg font-semibold text-(--white)">
                      {point.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-(--gray)">
                      {point.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between rounded-2xl px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-(--gray)">
                    Trust Layer
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-(--white)">
                    Detection credibility board
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {trustSignals.map((signal) => {
                  const Icon = signal.icon

                  return (
                    <div
                      key={signal.title}
                      className="rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border bg-(--primary)/10 border-(--primary) text-(--primary)">
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <h4 className="text-base font-semibold text-(--white)">
                            {signal.title}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-(--gray)">
                            {signal.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trust
