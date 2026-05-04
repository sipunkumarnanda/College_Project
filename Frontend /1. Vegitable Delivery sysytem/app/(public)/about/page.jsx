'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto text-slate-700">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-green-600 mb-3">About <span className="text-slate-800">FreshKart</span></h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          FreshKart connects you directly with trusted local farmers to bring you the freshest vegetables and fruits — clean, organic, and delivered right to your doorstep.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
          <p>
            At FreshKart, we believe that everyone deserves access to healthy, chemical-free produce. 
            Our mission is to bridge the gap between farmers and households by ensuring every order you place supports local communities.
          </p>
          <p>
            We source vegetables and fruits directly from small-scale farms around Odisha, ensuring fair prices for farmers and freshness for our customers. 
            Every product is handpicked, quality-checked, and packed with care.
          </p>
          <p>
            With our same-day delivery and instant return options, FreshKart makes healthy living simple, affordable, and sustainable. 
            Together, we can build a fresher, greener tomorrow!
          </p>

          <Link href="/contact">
            <button className="mt-6 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-all">
              Contact Us
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/images/about-freshkart.jpg"
            alt="FreshKart delivery"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 text-center">
        <div>
          <h2 className="text-3xl font-semibold text-green-600">500+</h2>
          <p className="text-sm text-slate-600">Happy Customers</p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-green-600">100+</h2>
          <p className="text-sm text-slate-600">Local Farmers</p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-green-600">30+</h2>
          <p className="text-sm text-slate-600">Delivery Locations</p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-green-600">1000+</h2>
          <p className="text-sm text-slate-600">Daily Deliveries</p>
        </div>
      </div>

    </div>
  )
}

export default About
