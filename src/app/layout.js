import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// import './globals.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

config.autoAddCss = false;

export const metadata = {
  title: 'E-Pustakaalay - Your Digital Library',
  description: 'A digital library application for books and resources',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* IBM Plex Sans font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/PDF_Flipbook/lib/css/main.css"/>
        <link rel="stylesheet" href="/PDF_Flipbook/lib/css/themify-icons.min.css"/>
      </head>
      <body>
        <Header />
        <div> 
          <main>
            {children}
          </main>
        </div>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
                integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" 
                crossOrigin="anonymous" 
                async></script>
      </body>
    </html>
  );
}