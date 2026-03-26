import React from 'react'

const sections = [
    {
        title: "Acceptance of Terms",
        content: `By accessing or using VistaView you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. We reserve the right to update these terms at any time; continued use after changes are posted constitutes acceptance of the revised terms.`
    },
    {
        title: "User Accounts",
        content: `You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You agree to provide accurate, current information and to notify us immediately of any unauthorized use of your account.`
    },
    {
        title: "Reviews and Content",
        content: `You retain ownership of content you submit (reviews, images, place listings). By submitting content you grant VistaView a worldwide, non-exclusive, royalty-free licence to display, reproduce, and distribute that content on the platform. You agree not to submit content that is false, misleading, defamatory, obscene, or in violation of any third-party rights.`
    },
    {
        title: "Prohibited Conduct",
        content: `You may not use VistaView to: post fake or incentivised reviews; scrape, crawl, or systematically download platform data; attempt to gain unauthorised access to any part of the platform; harass, threaten, or impersonate other users; or engage in any activity that disrupts or interferes with platform services.`
    },
    {
        title: "Owner Listings",
        content: `Place owners are responsible for the accuracy of their listings. VistaView reserves the right to remove or reject any listing that violates these terms or our content guidelines. Owner status requires verification and may be revoked if guidelines are breached. Approved listings do not constitute an endorsement by VistaView.`
    },
    {
        title: "Intellectual Property",
        content: `The VistaView name, logo, and platform design are the intellectual property of VistaView. You may not use them without prior written consent. Content created by VistaView (editorial copy, UI design, feature code) is protected by copyright and may not be reproduced or distributed without permission.`
    },
    {
        title: "Disclaimers",
        content: `VistaView provides the platform "as is" without warranties of any kind. We do not guarantee the accuracy of user-submitted reviews or listings. We are not liable for any travel decisions made based on platform content, or for any indirect, incidental, or consequential damages arising from use of the platform.`
    },
    {
        title: "Termination",
        content: `We reserve the right to suspend or terminate your account at our discretion if you violate these terms. You may close your account at any time by contacting support@vistaview.in. Upon termination, your right to use the platform ceases immediately, though your public reviews may remain visible in anonymised form.`
    },
    {
        title: "Governing Law",
        content: `These terms are governed by the laws of India. Any disputes arising from use of VistaView shall be subject to the exclusive jurisdiction of the courts of Ahmedabad, Gujarat.`
    },
    {
        title: "Contact",
        content: `Questions about these terms? Contact us at legal@vistaview.in. We aim to respond within 5 business days.`
    },
]
const Terms = () => {
  return (
      <div className='max-w-3xl mx-auto px-6 py-16'>
          <h1 className='text-4xl font-semibold mb-3'>Terms of Service</h1>
          <p className='text-text-muted text-sm mb-12'>Last updated: January 2026</p>

          <p className='text-text-secondary leading-relaxed mb-10'>These Terms of Service govern your use of the VistaView platform. Please read them carefully before using our services</p>

          <div className='space-y-10'>
              {sections.map((s, i) => (
                  <div key={s.title}>
                      <h2 className='text-lg font-semibold mb-3'>
                          {i+1}. {s.title}
                      </h2>
                      <p className='text-text-secondary leading-relaxed'>{s.content}</p>
                  </div>
              ))}
          </div>
    </div>
  )
}

export default Terms