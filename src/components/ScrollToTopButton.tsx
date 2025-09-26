import React from 'react';

interface ScrollToTopButtonProps {
  text: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ text }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-gray-500 text-white py-2 px-4 rounded-lg"
    >
      {text}
    </button>
  );
};

export default ScrollToTopButton;
