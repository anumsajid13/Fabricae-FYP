export const PortfolioHeader = () => {
  return (
    <div 
      className="relative w-full max-w-5xl mx-auto h-96 bg-cover bg-center flex flex-col items-center justify-center p-6 rounded-lg shadow-lg"
      style={{ backgroundImage: "url('/port31.jpg')" }}
    >
      {/* Fashion Design and Name */}
      <div className="absolute top-6 left-10 text-white text-2xl italic font-serif">
        Fashion design
      </div>
      <div className="absolute top-6 right-10 text-white text-2xl italic font-serif">
        Dieu Linh
      </div>

      {/* Portfolio Text */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white tracking-wide">
          PORTFOLIO
          <span className="text-5xl font-extrabold text-white">/24</span>
        </h1>
      </div>
    </div>
  );
 
  };
export const CollectionHeader = () => {
  return (
    <div 
      className="relative w-full max-w-5xl mx-auto h-96 bg-cover bg-center flex flex-col items-center justify-center p-6 rounded-lg shadow-lg"
      style={{ backgroundImage: "url('/port31.jpg')" }} // Change this to match your Collection 1 theme
    >
      {/* Fashion Design and Designer's Name */}
      <div className="absolute top-6 left-10 text-white text-2xl italic font-serif">
        Collection 1
      </div>
      <div className="absolute top-6 right-10 text-white text-2xl italic font-serif">
        Dieu Linh
      </div>

      {/* Collection Title */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white tracking-wide">
          COLLECTION
          <span className="text-5xl font-extrabold text-white"> 1</span>
        </h1>
      </div>
    </div>
  );
};

export const FashionMoodBoard = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto p-6 bg-[#600F0E] shadow-lg rounded-lg">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white uppercase tracking-widest text-center">
        Fashion Design Mood Board
      </h1>

      {/* Grid Layout */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <img
            src="/fashion1.jpg"
            alt="Fashion"
            className="rounded-lg shadow-md border-4 border-[#FFFFFF]"
          />
          <p className="italic text-lg text-white">
            "Fashion is the armor to survive the reality of everyday life."
          </p>
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/fashion2.jpg"
            alt="Textiles"
            className="rounded-lg shadow-md border-4 border-[#FFFFFF] w-3/4"
          />
          <div className="bg-[#8A1814] text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-serif tracking-wide">Texture & Patterns</h2>
            <p className="text-sm mt-2">
              Exploring the beauty of fabric textures, color palettes, and drapery.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 text-right">
          <p className="text-lg text-white font-medium">
            "Style is a way to say who you are without having to speak."
          </p>
          <img
            src="/fashion3.jpg"
            alt="Runway"
            className="rounded-lg shadow-md border-4 border-[#FFFFFF]"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 text-center text-white text-lg font-light tracking-wide">
        Fashion is an art, and this board captures its essence – from fabrics to silhouettes.
      </div>
    </div>
  );
};

export const ResearchWork = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto p-6 bg-[#5C0E0A] shadow-lg rounded-lg">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-white uppercase tracking-widest text-center">
        Research Work
      </h1>

      {/* Research Content Grid */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        
        {/* Left Section - Image */}
        <div className="space-y-4">
          <img
            src="/research1.jpg"
            alt="Research Paper"
            className="rounded-lg shadow-md border-4 border-[#FFFFFF]"
          />
          <p className="italic text-lg text-white">
            "Innovation is born through research and curiosity."
          </p>
        </div>

        {/* Center Section - Text Content */}
        <div className="flex flex-col items-center space-y-4 text-white">
          <h2 className="text-2xl font-serif tracking-wide">Key Findings</h2>
          <p className="text-sm text-center">
            Our research explores the intersection of fashion and technology, 
            focusing on AI-driven textile designs and sustainable materials.
          </p>
          <div className="bg-[#8A1814] p-4 rounded-lg shadow-lg w-full text-center">
            <h3 className="text-lg font-bold">Impact of AI in Fashion</h3>
            <p className="text-sm mt-2">
              AI-generated patterns are redefining creativity and efficiency.
            </p>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="space-y-4 text-right">
          <p className="text-lg text-white font-medium">
            "Research transforms ideas into reality."
          </p>
          <img
            src="/research2.jpg"
            alt="Data Visualization"
            className="rounded-lg shadow-md border-4 border-[#FFFFFF]"
          />
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-white text-lg font-light tracking-wide">
        "Research is the key to the future of fashion innovation."
      </div>

    </div>
  );
};


export const FashionCollection = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto p-6 bg-[#5C0E0A] shadow-lg rounded-lg">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-white uppercase tracking-widest text-center">
        Collection 1 - Timeless Elegance
      </h1>

      {/* Description */}
      <p className="text-lg text-white text-center mt-4">
        A curated selection of modern yet timeless pieces, blending classic silhouettes 
        with contemporary artistry. This collection embodies elegance, sophistication, and the art of craftsmanship.
      </p>

      {/* Collage Grid */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        
        {/* Image 1 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-1.jpg"
            alt="Collection 1 Look 1"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Image 2 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-2.jpg"
            alt="Collection 1 Look 2"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Image 3 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-3.jpg"
            alt="Collection 1 Look 3"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Image 4 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-4.jpg"
            alt="Collection 1 Look 4"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Image 5 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-5.jpg"
            alt="Collection 1 Look 5"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Image 6 */}
        <div className="overflow-hidden rounded-lg shadow-md border-4 border-[#FFFFFF]">
          <img
            src="/collection1-6.jpg"
            alt="Collection 1 Look 6"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

      </div>

      {/* Footer Quote */}
      <div className="mt-8 text-center text-white text-lg font-light tracking-wide">
        "A collection inspired by the grace of tradition and the boldness of the future."
      </div>

    </div>
  );
};



export const CollectionPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#5C0E0A] text-white shadow-md rounded-lg">
      
      {/* Title */}
      <h1 className="text-4xl font-bold uppercase tracking-wide text-center mb-6">
        Collection 1: Textures & Elegance
      </h1>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Textual Content */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-3">The Vision</h2>
          <p className="text-base leading-6">
            A blend of **classic sophistication** and **modern storytelling**. Inspired by **timeless textiles**, each piece embodies grace, power, and heritage.
          </p>

          <h2 className="text-2xl font-semibold mt-5 mb-3">The Inspiration</h2>
          <p className="text-base leading-6">
            Rooted in **ancient craftsmanship**, **architectural elegance**, and **nature’s beauty**. Soft drapes, intricate embroidery, and a refined color palette merge **tradition with modernity**.
          </p>

          <h2 className="text-2xl font-semibold mt-5 mb-3">The Goal</h2>
          <p className="text-base leading-6">
            Redefining **luxury fashion** through **sustainability** and **ethical craftsmanship**. Designed for those who appreciate **artistry, quality, and timeless beauty**.
          </p>
        </div>

        {/* Right: Image Collage */}
        <div className="grid grid-cols-2 gap-3">
          <img src="/collection1-1.jpg" alt="Design 1" className="w-full h-auto rounded-lg shadow-md"/>
          <img src="/collection1-2.jpg" alt="Design 2" className="w-full h-auto rounded-lg shadow-md"/>
          <img src="/collection1-3.jpg" alt="Design 3" className="w-full h-auto rounded-lg shadow-md"/>
          <img src="/collection1-4.jpg" alt="Design 4" className="w-full h-auto rounded-lg shadow-md"/>
        </div>
      </div>

      {/* Final Call-to-Action */}
      <div className="text-center mt-8">
        <p className="text-base">Want to explore more?</p>
        <button className="mt-3 px-5 py-2 bg-white text-[#5C0E0A] font-semibold text-base rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
          Contact the Designer
        </button>
      </div>
    </div>
  );
};


export const ContactMe1 = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto p-8 bg-[#5C0E0A] shadow-lg rounded-lg text-center">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-white uppercase tracking-widest">
        Let's Collaborate!
      </h1>

      {/* Subheading */}
      <p className="text-lg text-white mt-4">
        Interested in my work? Let's create something extraordinary together.  
        Feel free to reach out!
      </p>

      {/* Contact Information */}
      <div className="mt-6 text-white text-lg space-y-3">
        <p>Email: <a href="mailto:yourname@email.com" className="underline hover:text-gray-300">yourname@email.com</a></p>
        <p>Phone: <a href="tel:+1234567890" className="underline hover:text-gray-300">+123 456 7890</a></p>
      </div>

      {/* Social Media Links */}
      <div className="mt-6 flex justify-center space-x-6">
        <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <img src="/instagram-icon.svg" alt="Instagram" className="w-8 h-8 hover:scale-110 transition-transform duration-300"/>
        </a>
        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
          <img src="/linkedin-icon.svg" alt="LinkedIn" className="w-8 h-8 hover:scale-110 transition-transform duration-300"/>
        </a>
        <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <img src="/facebook-icon.svg" alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform duration-300"/>
        </a>
      </div>

      {/* Call-to-Action Button */}
      <button className="mt-8 px-6 py-3 bg-white text-[#5C0E0A] font-semibold text-lg rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
        Contact Me
      </button>

    </div>
  );
};
