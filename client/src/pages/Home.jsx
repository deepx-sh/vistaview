import { Star, MapPin, ShieldCheck, Users, LayoutDashboard, Umbrella, Church, Mountain, Hotel, Waves, Castle, Trees } from "lucide-react";
import { Link } from "react-router-dom";

import React from 'react'
import StatBox from "../components/ui/StatBox";
import FeatureBox from "../components/ui/FeatureBox";
import ReviewCard from "../components/ui/ReviewCard";



const Home = () => {
    const categories = [
  { category: "Beach", icon: <Umbrella size={24}/>, count: "142+" },
    { category: "Temple", icon: <Church/>, count: "215+" },
  { category: "Hill Station", icon: <Mountain/>, count: "227+" },
  { category: "Hotel", icon: <Hotel/>, count: "163+" },
  { category: "Lake", icon: <Waves/>, count: "283+" },
  { category: "Fort", icon: <Castle/>, count: "199+" },
  { category: "Park", icon: <Trees/>, count: "200+" }
];
  return (
      <div>
          {/* Hero Section */}
          <section className="py-20 px-6 text-center">
              <div className="max-w-4xl mx-auto">
                  
                  {/* Pill Badge */}
                  <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-1 rounded-full text-sm mb-6">
                      <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                      Find hidden gems
                  </div>


                  {/* Heading */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      Discover Your Next <span className="text-primary decoration-wavy underline">Adventure</span>
                  </h1>

                  {/* Paragraph */}
                  <p className="text-text-secondary max-w-2xl mx-auto mb-8">
                      Explore authentic travel destinations, read verified reviews, and uncover unforgettable experiences across the world
                  </p>


                  {/* Search Box */}
                  <div className="flex flex-col md:flex-row gap-3 justify-center max-w-2xl mx-auto">
                      <input type="text"
                          placeholder="Search places, cities..."
                          className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-md transition duration-200">Search</button>
                  </div>

                  {/* Stats Boxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
                      <StatBox number="1,200+" label="Places Listed"/>
                      <StatBox number="8,500+" label="Verified Reviews"/>
                      <StatBox number="25K+" label="Visitors" />
                      <StatBox number="4.8★" label="Average Rating" />
                  </div>
              </div>
          </section>

          {/* Category Section */}

          <section className="py-20 px-6 bg-surface">
              <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-3xl font-semibold mb-4">
                      Explore by Category
                  </h2>

                  <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
                      From serene beaches to ancient temples, find exactly what you're looking for
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
                      {categories.map((cat) => (
                          <div key={cat.category}
      className="bg-background flex flex-col justify-center items-center border-border rounded-lg border p-6 text-center transition hover:shadow-md"
    >
                              <div className="text-primary mx-auto mb-3">{ cat.icon}</div>
      <h3 className="font-medium">{cat.category}</h3>
                              <p className="text-text-muted mt-1 text-sm">{ cat.count}</p>
    </div>
                      ))}
                  </div>
              </div>
          </section>


          {/* Why Choose Section */}
          <section className="py-20 px-6">
              <div className="max-w-6xl mx-auto text-center">
                  
                  <h2 className="text-3xl font-semibold mb-4">
                      Why Choose VistaView
                  </h2>

                  <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
                      Powered by cutting-edge technology to enhance your travel planning
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <FeatureBox icon={<ShieldCheck/>} title="Verified Reviews" desc="Only genuine reviews from real travelers"/>
                      <FeatureBox icon={<MapPin/>} title="Location Intelligence" desc="Smart recommendations based on your location"/>
                      <FeatureBox icon={<Users/>} title="Verified Owners" desc="Trusted listings managed by verified owners"/>
                      <FeatureBox icon={<LayoutDashboard/>} title="Owner Dashboard" desc="Powerful analytics and management tools"/>
                      <FeatureBox icon={<Star/>} title="Community Driven" desc="A growing network of passionate travelers"/>
                  </div>
              </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-6 bg-surface">
              <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-3xl font-semibold mb-4">
                      Loved by Travelers
                  </h2>

                  <p className="text-text-secondary mb-12">
                      Join thousands of satisfied users exploring the world with confidence
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <ReviewCard name="Deep" />
                      <ReviewCard name="Madison Beer" />
                      <ReviewCard name="Taylor Swift"/>
                  </div>
              </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6 text-center">
              <div className="max-w-3xl mx-auto bg-primary text-white rounded-xl p-12 shadow-md">
                  <h2 className="text-3xl font-semibold mb-4">
                      Ready to Start Your Journey?
                  </h2>

                  <p className="mb-8 text-white/90">
                      Join VistaView today and unlock a world of authentic travel experiences</p>
                  
                  <Link to="/register" className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">Sign Up Now</Link>
              </div>
          </section>
    </div>
  )
}

export default Home