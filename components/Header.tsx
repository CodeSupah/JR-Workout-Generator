
import React from 'react';
import { JumpLogoIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-gray-900/70 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <JumpLogoIcon className="h-10 w-auto" />
        </div>
      </div>
    </header>
  );
};

export default Header;