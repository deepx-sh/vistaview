import React from 'react'
import { ShieldCheck, Users, MapPin, Star } from 'lucide-react'

const About = () => {
  return (
      <div className='max-w-4xl mx-auto px-6 py-16'>
          {/* Hero */}
          <div className='text-center mb-16'>
              <h1 className='text-4xl font-semibold mb-4'>About VistaView</h1>
              <p className='text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed'>
                  We're on a mission to help travelers discover authenticate places and share genuine experiences powered by a community of real people, not algorighms
              </p>
          </div>

          {/* Mission */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
              <div className='bg-surface border border-border rounded-xl p-8'>
                  <h2 className='text-xl font-semibold mb-3'>Our Mission</h2>
                  <p className='text-text-secondary leading-relaxed'>Travel decisions deserve honest information. VistaView connects travelers with verified, community-driven reviews so every trip is build on trues not sponsored content</p>
              </div>
          

          <div className='bg-surface border border-border rounded-xl p-8'>
              <h2 className='text-xl font-semibold mb-3'>Our Vision</h2>
              <p className='text-text-secondary leading-relaxed'>
                  A world where every hidden gem has a voice,every traveler has a guider, and every place owner can share their story with the people who matter most
              </p>
              </div>
          </div>
          <div className='mb-16'>
              <h2 className='text-2xl font-semibold text-center mb-10'>What We Stand For</h2>
              <div className='grid grid-cols-1 sm:grid lg:grid-cols-4 gap-6'>
                  {[{ icon: <ShieldCheck size={28} />, title: "Verified Reviews", desc: "Every review is from a real traveler with a verified accound." },
                      { icon: <Users size={28} />, title: "Community First", desc: "Built by travelers, for travelers. The community shapes the platform." },
                      { icon: <MapPin size={28} />, title: "Local Expertise", desc: "We surface local knowledge over generic tourist traps." },
                      { icon: <Star size={28} />, title: "Quality over Quantity", desc: "We'd rather have fewer, honest listings than thousands of inflated ones." }].map((item) => (
                          <div key={item.title} className='bg-surface border border-border rounded-xl p-6 text-center'>
                              <div className='text-primary mb-4 flex justify-center'>{item.icon}</div>
                              <h3 className='font-semibold mb-2'>{item.title}</h3>
                              <p className='text-sm text-text-secondary'>{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          <div className='bg-primary rounded-xl p-10 text-white text-center'>
              <h2 className='text-2xl font-semibold mb-8'>VistaView by the Numbers</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                  {[
                      {n:"1,200+",l:"Places Listed"},
                      {n:"8,500+",l:"Verified Reviews"},
                      { n: "25K+", l: "Active Travelers" },
                      { n: "4.8★", l: "Average Rating" },
                  ].map((s) => (
                      <div key={s.l}>
                          <p className='text-3xl font-semibold'>{s.n}</p>
                          <p className='text-white/80 text-sm mt-1'>{s.l}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

  )
}

export default About