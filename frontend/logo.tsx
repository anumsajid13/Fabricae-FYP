import Image from 'next/image';

export default function AcmeLogo () {
  return (
    <div>
      <Image 
        src="/logo.png" // Image path relative to the public folder
        alt="Acme Logo" 
        width={200} // Specify the width of the image
        height={100} // Specify the height of the image
      />
    </div>
  );
}
