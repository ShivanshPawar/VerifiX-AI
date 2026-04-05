import React from 'react'

const FeatureCard = ({ title, description }) => {
    return (
        <div className="glass glass-ring glass-hover p-6 rounded-2xl">

            <h3 className="text-xl font-semibold mb-3">
                {title}
            </h3>

            <p className="text-(--gray) text-sm leading-relaxed">
                {description}
            </p>

        </div>
    )
}

export default FeatureCard