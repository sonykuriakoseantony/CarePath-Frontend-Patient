import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HiArrowRight } from "react-icons/hi";
import { LuClipboardList, LuShield, LuHeartPulse } from 'react-icons/lu';
import { FiUserCheck, FiCalendar, FiSearch, FiClock } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  const steps = [
    {
      number: 1,
      title: 'Submit Your Symptoms',
      description: 'Describe your symptoms, their duration, and severity through our secure form.',
      icon: LuClipboardList,
    },
    {
      number: 2,
      title: 'Expert Review',
      description: 'Our medical team reviews your submission and identifies the appropriate specialist.',
      icon: FiSearch,
    },
    {
      number: 3,
      title: 'Specialist Matching',
      description: 'We match you with the right specialist based on your specific needs.',
      icon: FiUserCheck,
    },
    {
      number: 4,
      title: 'Book Appointment',
      description: 'Once approved, schedule your consultation at your convenience.',
      icon: FiCalendar,
    },
  ];

  const benefits = [
    {
      icon: LuShield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security.'
    },
    {
      icon: FiClock,
      title: 'Save Time',
      description: 'No more confusion about which specialist to visit.'
    },
    {
      icon: LuHeartPulse,
      title: 'Expert Guidance',
      description: 'Medical professionals review every case personally.'
    },
  ];

  return (
    <div className="min-h-screen [background:var(--gradient-hero)]">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {isAuthenticated && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
                <FaCheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Welcome back, {user.name}!</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Find the Right Specialist for Your Health Needs
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Not sure which doctor to see? Our guided system helps you identify the right
              specialist based on your symptoms, ensuring you get the care you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  Go to Dashboard
                  <HiArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                    Get Started Free
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="btn-outline">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our simple four-step process guides you from symptom submission to specialist consultation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="card-medical relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -z-10" />
                )}

                <div className="step-indicator step-active mb-4">
                  {step.number}
                </div>

                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                <p className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>


      </section>
      {/* Stats Section */}
      <section className='pt-5 pb-20 bg-card/50'>
        <div className='container mx-auto px-4 lg:max-w-5xl'>
          <div className="bg-gradient-to-r from-primary/5 to-success/5 rounded-3xl p-12 border border-primary/20">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-black text-primary mb-2">95%</div>
                <div className="text-muted-foreground font-medium">Match Accuracy</div>
              </div>
              <div>
                <div className="text-5xl font-black text-success mb-2">24h</div>
                <div className="text-muted-foreground font-medium">Average Response</div>
              </div>
              <div>
                <div className="text-5xl font-black text-primary mb-2">10K+</div>
                <div className="text-muted-foreground font-medium">Happy Patients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose MedCare?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We prioritize your health and privacy while making healthcare accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl [background:var(--gradient-primary)] flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 [background:var(--gradient-primary)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of patients who have found the right specialist through our platform.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-card text-primary px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              Create Free Account
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

    </div>
  )
}

export default Home