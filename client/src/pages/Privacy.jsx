import React from 'react'

const sections = [
    {
        title: "Information We Collect",
        content: `When you create an account, we collect your name, email address, and password (stored as a secure hash). When you write a review or list a place, we collect the content you submit including text, ratings, and images. We also collect usage data such as pages visited and searches performed to improve the platform.`
    },
    {
        title: "How We Use Your Information",
        content: `We use your information to provide and improve VistaView's services, send transactional emails (OTP verification, review notifications, owner approval updates), display your public profile and reviews, and ensure platform security. We do not sell your personal data to third parties.`
    },
    {
        title: "Cookies",
        content: `We use HTTP-only cookies to manage authentication sessions (access and refresh tokens). These cookies are essential for the platform to function and cannot be disabled while using VistaView. We do not use tracking or advertising cookies.`
    },
    {
        title: "Data Sharing",
        content: `We share data with Cloudinary (image storage) and Brevo (transactional email delivery) solely to provide platform features. These services process your data only as directed by us under their respective data processing agreements. We do not share your data with any other third parties.`
    },
    {
        title: "Data Retention",
        content: `We retain your account data for as long as your account is active. Deleted reviews are soft-deleted for up to 7 days before permanent removal. You may request full account deletion by contacting us at support@vistaview.in, after which all personal data will be removed within 30 days.`
    },
    {
        title: "Security",
        content: `Passwords are hashed using bcrypt. Authentication tokens are stored in HTTP-only cookies and are not accessible via JavaScript. Images are served over HTTPS via Cloudinary's CDN. We follow industry-standard practices to protect your data, though no system is completely immune to security risks.`
    },
    {
        title: "Your Rights",
        content: `You have the right to access, correct, or delete your personal data at any time. You can update your name and profile picture from your Profile page. To request a data export or full account deletion, contact us at support@vistaview.in.`
    },
    {
        title: "Contact",
        content: `For any privacy-related questions or requests, please contact our team at privacy@vistaview.in. We will respond within 5 business days.`
    },
]
const Privacy = () => {
  return (
      <div className='max-w-3xl mx-auto px-6 py-16'>
          <h1 className='text-4xl font-semibold mb-3'>Privacy Policy</h1>
          <p className='text-text-muted text-sm mb-12'>Last updated: January 2026</p>

          <p className='text-text-secondary leading-relaxed mb-10'>
              VistaView("we", "our", "us") is commited to protecting your privacy. This policy explains what data we collect, how we use it, and the rights you have over it. By using VistaView you agree to the prractices described here
          </p>

          <div className='space-y-10'>
              {sections.map((s, i) => (
                  <div key={s.title}>
                      <h2 className='text-lg font-semibold mb-3'>{i + 1}. {s.title}</h2>
                      <p className='text-text-secondary leading-relaxed'>{s.content}</p>
                  </div>
              ))}
          </div>
    </div>
  )
}

export default Privacy