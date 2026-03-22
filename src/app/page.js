'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  HiOutlineLightBulb,
  HiOutlineRocketLaunch,
  HiOutlineCloud,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-primary-50 to-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">
                Good Samaritan Institute
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {!session ? (
                <>
                  <Link
                    href="/login"
                    className="text-primary-700 hover:text-primary-800 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-neutral-700">
                    Welcome, {session.user?.name}
                  </span>
                  <Link href="/dashboard" className="btn-primary">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight">
                Transform Your Business with{' '}
                <span className="gradient-text">Expert IT Solutions</span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed">
                Good Samaritan Institute delivers strategic IT consulting,
                digital transformation, and technology solutions tailored to
                your business needs. Partner with us to unlock your full
                potential.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={session ? '/dashboard' : '/register'} className="btn-primary">
                Get Started Today
              </Link>
              <Link href="#services" className="btn-outline">
                Explore Services
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary-700">500+</p>
                <p className="text-neutral-600">Successful Projects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-700">100+</p>
                <p className="text-neutral-600">Enterprise Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-700">15+</p>
                <p className="text-neutral-600">Years Experience</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 rounded-2xl opacity-10 blur-3xl"></div>
            <div className="relative h-full bg-gradient-to-br from-primary-700 to-accent-700 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <HiOutlineRocketLaunch className="w-32 h-32 mx-auto mb-4 opacity-80" />
                <p className="text-2xl font-bold">Ready for Digital Growth?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive IT consulting solutions designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* IT Strategy */}
            <div className="card group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-lg group-hover:bg-primary-700 transition-colors mb-4">
                <HiOutlineLightBulb className="w-7 h-7 text-primary-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                IT Strategy
              </h3>
              <p className="text-neutral-600">
                Strategic planning and roadmap development to align technology
                with your business objectives.
              </p>
            </div>

            {/* Digital Transformation */}
            <div className="card group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-center w-14 h-14 bg-accent-100 rounded-lg group-hover:bg-accent-700 transition-colors mb-4">
                <HiOutlineRocketLaunch className="w-7 h-7 text-accent-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Digital Transformation
              </h3>
              <p className="text-neutral-600">
                Modernize your operations and customer experience through
                innovative digital solutions.
              </p>
            </div>

            {/* Cloud Solutions */}
            <div className="card group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-lg group-hover:bg-primary-700 transition-colors mb-4">
                <HiOutlineCloud className="w-7 h-7 text-primary-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Cloud Solutions
              </h3>
              <p className="text-neutral-600">
                Migration, optimization, and management of cloud infrastructure
                for scalability and efficiency.
              </p>
            </div>

            {/* Cybersecurity */}
            <div className="card group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-center w-14 h-14 bg-accent-100 rounded-lg group-hover:bg-accent-700 transition-colors mb-4">
                <HiOutlineShieldCheck className="w-7 h-7 text-accent-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Cybersecurity
              </h3>
              <p className="text-neutral-600">
                Protect your assets with comprehensive security assessments and
                proactive threat management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            A streamlined process to deliver results for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative animate-slide-up">
            <div className="card-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-700 text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Consultation
              </h3>
              <p className="text-neutral-600">
                We meet with you to understand your challenges, goals, and
                current technology landscape.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/3 -right-4 text-primary-700 text-3xl">
              →
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative animate-slide-up">
            <div className="card-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-700 text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Agreement
              </h3>
              <p className="text-neutral-600">
                We develop a clear proposal with timeline, deliverables, and
                investment aligned with your needs.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/3 -right-4 text-primary-700 text-3xl">
              →
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative animate-slide-up">
            <div className="card-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-700 text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Onboard
              </h3>
              <p className="text-neutral-600">
                Our expert team begins work with your organization, providing
                regular updates and collaboration.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/3 -right-4 text-primary-700 text-3xl">
              →
            </div>
          </div>

          {/* Step 4 */}
          <div className="animate-slide-up">
            <div className="card-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-700 text-white font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Deliver
              </h3>
              <p className="text-neutral-600">
                We deliver results, provide knowledge transfer, and ensure your
                team can sustain the solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-accent-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Technology?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Contact Douglas and the team at Good Samaritan Institute to discuss
            your consulting needs.
          </p>
          <Link
            href={session ? '/dashboard' : '/register'}
            className="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Schedule Your Consultation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Good Samaritan Institute
              </h3>
              <p className="text-sm">
                Leading IT and technology consulting firm serving enterprise
                clients worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    IT Strategy
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Digital Transformation
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Cloud Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Cybersecurity
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; 2024 Good Samaritan Institute. All rights reserved. Owner:
              Douglas
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
