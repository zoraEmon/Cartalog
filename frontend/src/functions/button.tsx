import React, {useState} from 'react';

export const NavButton = (navigate: (path: string) => void, page: string) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  navigate(page);
};

export const HandleClick = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDiv = () => {
    setIsVisible(prev => !prev);
  };

  return { isVisible, toggleDiv };
};

