
'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

  // Default to INR symbol but keep env override if you use it
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

  return (
    <div className='mx-6'>
      <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
        {/* Left - Main Hero Card */}
        <div className='relative flex-1 flex flex-col bg-[#DFF5D8] rounded-3xl xl:min-h-100 group overflow-hidden'>
          <div className='p-5 sm:p-16'>
            <div className='inline-flex items-center gap-3 bg-[#B5E7A0] text-green-700 pr-4 p-1 rounded-full text-xs sm:text-sm'>
              <span className='bg-green-700 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>FRESH DEAL</span>
              Free Delivery on Orders Above ₹499!
              <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
            </div>

            <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-green-700 to-lime-400 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
              Fresh veggies from farm to your home.
            </h2>

            <div className='text-green-800 text-sm font-medium mt-4 sm:mt-8'>
              <p>Starts from</p>
              <p className='text-3xl'>{currency}49</p>
            </div>

            <button
              className='bg-green-700 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-green-800 transform transition active:scale-95'
              aria-label='Shop now'
            >
              SHOP NOW
            </button>
          </div>

          {/* Hero image positioned at bottom-right */}
          <Image
            className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
            src={assets.hero_model_img}
            alt='Basket of fresh vegetables'
            priority
          />
        </div>

        {/* Right - Two stacked cards */}
        <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
          {/* Top small card - Season's Picks */}
          <div className='flex-1 flex items-center justify-between w-full bg-[#FFE8C2] rounded-3xl p-6 px-8 group overflow-hidden'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-orange-700 to-lime-600 bg-clip-text text-transparent max-w-40'>
                Season’s Picks
              </p>
              <p className='flex items-center gap-1 mt-4 text-green-700'>
                View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} />
              </p>
            </div>
            <Image
              className='w-35'
              src={assets.hero_product_img1}
              alt='Fresh produce - tomatoes & greens'
            />
          </div>

          {/* Bottom small card - Discount */}
          <div className='flex-1 flex items-center justify-between w-full bg-[#CDE7FF] rounded-3xl p-6 px-8 group overflow-hidden'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-green-700 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>
                Get 20% Off
              </p>
              <p className='text-green-700 text-sm mt-1'>on Organic Vegetables</p>
              <p className='flex items-center gap-1 mt-3 text-green-700'>
                View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} />
              </p>
            </div>
            <Image
              className='w-35'
              src={assets.hero_product_img2}
              alt='Assorted organic vegetables'
            />
          </div>
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  )
}

export default Hero
