import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
      <Toaster position="bottom-right" />
    </>
  );
}
