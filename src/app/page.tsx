import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">HireAI</div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="hover:text-primary-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary-300 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-primary-300 transition-colors">Pricing</a>
          <Link href="/login" className="hover:text-primary-300 transition-colors">Login</Link>
        </div>
        <Link 
          href="/onboarding" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Try for Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          AI-Powered Hiring, <span className="text-primary-300">Simplified</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Transform your recruitment process with our AI-driven platform that finds and vets the best talent for your company.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/onboarding" 
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            Get Started for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="border border-gray-600 hover:bg-gray-800/50 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Candidate Matching',
                description: 'Automatically match job requirements with the best candidates using advanced AI algorithms.'
              },
              {
                title: 'Automated Screening',
                description: 'Save time with automated resume screening and candidate ranking.'
              },
              {
                title: 'Collaborative Hiring',
                description: 'Involve your team in the hiring process with easy collaboration tools.'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of companies that trust our platform to find their next great hire.
          </p>
          <Link 
            href="/onboarding" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">HireAI</div>
            <div className="text-gray-400 text-sm">
              {new Date().getFullYear()} HireAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
