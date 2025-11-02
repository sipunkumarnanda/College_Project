import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title 
                title="Join Our Green Community" 
                description="Subscribe to get updates on fresh harvests, seasonal offers, and healthy recipes delivered straight to your inbox." 
                visibleButton={false} 
            />
            <div className='flex bg-green-50 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-green-200 ring ring-green-100'>
                <input 
                    className='flex-1 pl-5 outline-none bg-transparent text-slate-700' 
                    type="email" 
                    placeholder='Enter your email address' 
                />
                <button className='font-medium bg-green-600 text-white px-7 py-3 rounded-full hover:bg-green-700 hover:scale-105 active:scale-95 transition'>
                    Get Fresh Updates
                </button>
            </div>
        </div>
    )
}

export default Newsletter
