'use client'

export default function Hero() {
  const handleScroll = () => {
    const nextSection = document.getElementById('about')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative w-full h-screen min-h-96 flex items-center justify-center text-center -mt-24 pt-24 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Hero Content */}
      <div className="max-w-4xl px-5 z-20">
        <div className="text-white">
          <h1 className="text-6xl md:text-7xl leading-tight font-bold mb-6 drop-shadow-lg">
            <span className="block text-light-blue font-medium text-xl md:text-2xl letter-spacing-wider mb-4 uppercase">
              Welcome to
            </span>
            Centre for Peace Praxis
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95 font-light">
            Hope, Healing and Resilience for a Better Tomorrow
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-5 justify-center flex-wrap">
            <button className="inline-block bg-accent hover:bg-transparent text-white hover:text-black px-10 py-4 rounded-full font-bold text-lg smooth-transition border-2 border-accent shadow-lg hover:shadow-2xl hover:-translate-y-1.5">
              Get Started
            </button>
            <button className="inline-block bg-transparent hover:bg-white text-white hover:text-primary px-10 py-4 rounded-full font-bold text-lg smooth-transition border-2 border-white hover:shadow-xl hover:-translate-y-1.5">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow cursor-pointer text-white text-3xl z-20"
        onClick={handleScroll}
        role="button"
        tabIndex={0}
      >
        <i className="fas fa-chevron-down"></i>
      </div>

      {/* Overlay Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>
    </section>
  )
}
