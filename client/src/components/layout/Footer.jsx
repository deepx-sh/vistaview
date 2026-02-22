import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";
import React from 'react'

const Footer = () => {
  return (
      <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-6 py-12">
              
              {/* Top Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {/* Brand Section */}

                  <div>
                      <h2 className="text-xl font-semibold text-primary mb-4">
                          VistaView
                      </h2>

                      <p className="text-text-secondary text-sm leading-relaxed">
                          Discover authentic travel experiences through verified reviews from real travelers
                      </p>

                      <div className="flex gap-4 mt-6">
                          <a href="" className="text-text-muted hover:text-primary transition duration-200">
                              <Facebook size={18}/>
                          </a>
                          <a href="" className="text-text-muted hover:text-primary transition duration-200">
                              <Instagram size={18}/>
                          </a>
                          <a href="" className="text-text-muted hover:text-primary transition duration-200">
                              <Linkedin size={18}/>
                          </a>
                          <a href="" className="text-text-muted hover:text-primary transition duration-200">
                              <Github size={18}/>
                          </a>
                      </div>
                  </div>

                  {/* Explore */}
                  <div>
                      <h3 className="font-medium mb-4">Explore</h3>
                      <ul className="space-y-2 text-sm text-text-secondary">
                          <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
                          <li><Link to="/featured" className="hover:text-primary">Featured Places</Link></li>
                          <li><Link to="/top-rated" className="hover:text-primary">Top Rated</Link></li>
                          <li><Link to="/nearby" className="hover:text-primary">Nearby</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h3 className="font-medium mb-4">For Owners</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                          <li><Link to="/owner/apply" className="hover:text-primary">List Your Place</Link></li>
                          <li><Link to="/owner/dashboard" className="hover:text-primary">Dashboard</Link></li>
                          <li><Link to="/owner/analytics" className="hover:text-primary">Analytics</Link></li>
                      </ul>
                  </div>

                  <div>
                        <h3 className="font-medium mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                          <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                          <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                          <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                      </ul>
                  </div>
              </div>

              {/* Bottom Section */}

              <div className="border-t border-border mt-10 pt-6 text-center text-sm text-text-muted">
                   © 2026 VistaView. All rights reserved.
              </div>
          </div>
    </footer>
  )
}

export default Footer