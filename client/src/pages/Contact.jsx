import React, { useState } from 'react'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error("Please fill in all required fields")
            return
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false)
            toast.success("Message sent! We'll get back to you within 24 hours")
            setForm({name:"",email:"",subject:"",message:""})
        },800)
    }
  return (
      <div className='max-w-5xl mx-auto px-6 py-12'>
          <div className='text-center mb-12'>
              <h1 className='text-4xl font-semibold mb-4'>Contact Us</h1>
              <p className='text-text-secondary max-w-xl mx-auto'>Have a question, suggestion, or issue? We'd love to hear from you</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
              <div className='space-y-8'>
                  {[
                      {
                          icon: <Mail size={20} />,
                          title: "Email US",
                          detail: "support@vistaview.in",
                          sub:"We reply within 24 hours"
                      },
                      {
                          icon: <MessageSquare size={20} />,
                          title: "General Enquiries",
                          detail: "support@vistaview.in",
                          sub:"Partnerships, press, feedback"
                      },
                      {
                          icon: <Clock size={20} />,
                          title: "Support Hours",
                          detail: "Mon - Sat, 9am - 6 pm IST",
                          sub:"We're closed on Sundays"
                      }
                  ].map((item) => (
                      <div key={item.title} className='bg-surface border border-border rounded-xl p-5 flex gap-4'>
                          <div className='text-primary mt-0.5 shrink-0'>{item.icon}</div>
                          <div>
                              <p className='font-medium text-sm'>{item.title}</p>
                              <p className='text-text-primary text-sm mt-0.5'>{item.detail}</p>
                              <p className='text-text-muted text-xs mt-0.5'>{item.sub}</p>
                          </div>
                      </div>
                  ))}
              </div>


              <div className='lg:col-span-2 bg-surface border border-border rounded-xl p-8'>
                  <form onSubmit={handleSubmit} className='space-y-5'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                          <div>
                              <label className='block text-sm font-medium mb-1.5'>Name <span className='text-danger'>*</span></label>
                              <input type="text"
                                  name='name'
                                  value={form.name}
                                  onChange={handleChange}
                                  placeholder='Your name'
                                  className='w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                                  required
                              />
                          </div>

                          <div>
                              <label className='block text-sm font-medium mb-1.5'>Email <span className='text-danger'>*</span></label>
                              <input type="email"
                                  name='email'
                                  value={form.email}
                                  onChange={handleChange}
                                  placeholder='deep@example.com'
                                  className='w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                                  required
                              />
                          </div>
                      </div>

                      <div>
                          <label className='block text-sm font-medium mb-1.5'>Subject</label>
                          <input type="text"
                              name='subject'
                              value={form.subject}
                              onChange={handleChange}
                              placeholder="What's this about?"
                              className='w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                              required
                          />
                      </div>

                      <div>
                          <label className='block text-sm font-medium mb-1.5'>Message <span className='text-danger'>*</span></label>
                          <textarea
                              name='message'
                              value={form.message}
                              onChange={handleChange}
                              rows={5}
                              placeholder='Tell us how we can help...'
                              className='w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus-ring-2 focus:ring-primary resize-none'
                              required
                          />
                      </div>

                      <button
                          type="submit"
                          disabled={loading}
                          className='w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-md text-sm transition duration-200 disabled:opacity-60'
                      >{loading ? "Sending":"Send Message"}</button>
                  </form>
              </div>
          </div>
    </div>
  )
}

export default Contact