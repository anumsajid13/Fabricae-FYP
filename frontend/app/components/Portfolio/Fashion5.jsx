import React from "react";

export const SketchesIllustrations =() =>{
 return (
   <div
     className="relative bg-cover bg-center py-20 portfolio-page"
     style={{ backgroundImage: "url('/Picture7.jpg')" }}
   >
     <div className="bg-[#b4967a] p-8 mx-8 md:mx-16 rounded-lg grid md:grid-cols-2 items-center">
       <div className="text-white">
         <h1 className="text-4xl font-semibold mb-4">Sketches and Illustrations</h1>
         <p className="text-lg mb-6">
           Display your design skills through fashion sketches and illustrations.
           Include both rough sketches and polished drawings to showcase your range.
         </p>
         <h2 className="font-bold text-xl">NEW FASHION</h2>
       </div>
       <div className="flex justify-center">
         <img
           src="/Picture16.jpg"
           alt="Fashion Illustration"
           className="rounded-lg object-cover max-h-72 md:max-h-80"
         />
       </div>
     </div>
   </div>
 );
};

