
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title 
                visibleButton={false} 
                title='Why Shop With FreshKart' 
                description="We’re committed to delivering fresh, locally sourced vegetables straight from farms to your doorstep — fast, clean, and eco-friendly." 
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
                {
                    ourSpecsData.map((spec, index) => (
                        <div 
                            key={index}
                            className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group shadow-sm hover:shadow-md transition'
                            style={{ 
                                backgroundColor: spec.accent + "10", 
                                borderColor: spec.accent + "30" 
                            }}
                        >
                            <div 
                                className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition' 
                                style={{ backgroundColor: spec.accent }}
                            >
                                <spec.icon size={20} />
                            </div>
                            <h3 className='text-green-800 font-semibold'>{spec.title}</h3>
                            <p className='text-sm text-slate-600 mt-3'>{spec.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default OurSpecs
