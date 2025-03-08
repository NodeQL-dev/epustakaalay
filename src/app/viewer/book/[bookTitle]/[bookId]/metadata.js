import { notFound } from 'next/navigation';

// Generate static metadata for SEO
export async function generateMetadata({ params }) {
  const { bookTitle, bookId } = params;
  
  // Format the title for display (from slug to readable)
  const formattedTitle = bookTitle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: `${formattedTitle} | E-Pustakaalay`,
    description: `Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`,
    openGraph: {
      title: `${formattedTitle} | E-Pustakaalay`,
      description: `Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`,
      type: 'book',
      url: `https://e-pustakaalay.vercel.app/viewer/book/${bookTitle}/${bookId}`,
      images: [
        {
          url: 'https://e-pustakaalay.vercel.app/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${formattedTitle} - E-Pustakaalay`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedTitle} | E-Pustakaalay`,
      description: `Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`,
      images: ['https://e-pustakaalay.vercel.app/images/og-image.jpg'],
    },
  };
}

// This ensures that users get a proper 404 for invalid book IDs
export async function generateStaticParams() {
  // In a real implementation, you would fetch all valid book IDs from your database
  // For now, we'll return an empty array which will make all paths dynamic
  return [];
}