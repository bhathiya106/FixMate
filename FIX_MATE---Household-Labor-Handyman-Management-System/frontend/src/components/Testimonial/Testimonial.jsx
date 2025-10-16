import React from 'react'

const Testimonial = () => {

    
  const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      name: 'Michael Chen',
      handle: '@homeowner_mike',
      date: 'March 15, 2025',
      feedback: "FixMate's plumber fixed my kitchen leak in under 2 hours. Professional, clean work, and fair pricing. Highly recommend!"
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      name: 'Sarah Johnson',
      handle: '@sarah_renovates',
      date: 'February 28, 2025',
      feedback: "Amazing electrical work! They rewired my entire living room safely and efficiently. The team was punctual and respectful."
    },
    {
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      name: 'David Rodriguez',
      handle: '@david_home_guy',
      date: 'March 8, 2025',
      feedback: "Best handyman service in town! Fixed my deck, painted my fence, and installed new shelves. Quality work at great prices."
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      name: 'Emma Thompson',
      handle: '@emma_fixes',
      date: 'March 20, 2025',
      feedback: "Called FixMate for emergency toilet repair at 8PM. They came within an hour and fixed it perfectly. Lifesavers!"
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      name: 'James Wilson',
      handle: '@james_diy_dad',
      date: 'February 15, 2025',
      feedback: "Outstanding carpentry work! Built custom cabinets for my garage. Exceeded expectations in both quality and timeline."
    },
    {
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200',
      name: 'Lisa Martinez',
      handle: '@lisa_homemaker',
      date: 'March 12, 2025',
      feedback: "FixMate painted my entire house exterior. Clean, professional job with premium materials. Looks brand new!"
    },
    {
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=200',
      name: 'Robert Kim',
      handle: '@bob_fixes_stuff',
      date: 'March 5, 2025',
      feedback: "HVAC repair done right! My heating system works better than ever. Fair pricing and excellent customer service."
    },
    {
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200',
      name: 'Jennifer Davis',
      handle: '@jen_home_owner',
      date: 'February 22, 2025',
      feedback: "Fantastic tile work in my bathroom! Attention to detail was incredible. Clean up was perfect too. 5 stars!"
    }
  ]

  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-lg mx-3 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white border border-gray-100">
      
      <div className="flex gap-3">
        <img className="w-12 h-12 rounded-full object-cover" src={card.image} alt={`${card.name} - Customer`} />
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <p>{card.name}</p>
            <svg
              className="mt-0.5 text-blue-600"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>

      
      <div className="flex items-center gap-1 mt-3 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>

      
      <p className="text-sm py-3 text-gray-700 leading-relaxed">
        {card.feedback}
      </p>

     
      <div className="flex items-center justify-between text-slate-500 text-xs pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span>Posted on</span>
          <a href="https://x.com" target="_blank" className="hover:text-blue-500 transition-colors">
            <svg
              width="12"
              height="11"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <p className="font-medium">{card.date}</p>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 35s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="bg-gray-50 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
          <p className="text-gray-600">Real reviews from satisfied homeowners</p>
        </div>

        
        <div className="marquee-row w-full mx-auto overflow-hidden relative mb-6">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%] py-4">
            {[...cardsData.slice(0, 4), ...cardsData.slice(0, 4)].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
        </div>

       
        <div className="marquee-row w-full mx-auto overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
            {[...cardsData.slice(4, 8), ...cardsData.slice(4, 8)].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
        </div>
      </div>
    </>
  )
}

export default Testimonial