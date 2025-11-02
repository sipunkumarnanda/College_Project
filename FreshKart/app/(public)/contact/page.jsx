
'use client'
import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'

const Contact = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto text-slate-700">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-green-600 mb-3">
          Contact <span className="text-slate-800">Us</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          Have a question, suggestion, or feedback? We’d love to hear from you!  
          Our team is always ready to assist you with your FreshKart experience.
        </p>
      </div>

      {/* Contact Info & Form Section */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        
        {/* Left - Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Get in Touch</h2>
            <p className="text-slate-600 text-sm md:text-base">
              Reach out through the form or contact us directly via phone or email.  
              We usually respond within a few hours!
            </p>
          </div>

          <div className="space-y-6 mt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <MapPin size={20} />
              </div>
              <p className="text-sm md:text-base text-slate-600">
                Takatpur Road, Baripada, Mayurbhanj, Odisha, 757001
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <Phone size={20} />
              </div>
              <p className="text-sm md:text-base text-slate-600">
                +91 94370 01234
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <Mail size={20} />
              </div>
              <p className="text-sm md:text-base text-slate-600">
                support@freshkart.in
              </p>
            </div>
          </div>

          <div className="mt-10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14719.52874198234!2d86.7102!3d21.9336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1f6f7cbffef9a7%3A0x8b8d5f7ed134b0b3!2sBaripada%2C%20Odisha%20757001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg border"
            ></iframe>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Send a Message</h2>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
