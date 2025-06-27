import React from 'react';
import { NavLink } from 'react-router-dom';
import { SparklesIcon } from '../icons/SparklesIcon';

const Header: React.FC = () => {
  const linkClasses = "px-3 py-2 text-base font-medium text-onSurface/80 hover:text-onSurface transition-colors";
  const activeLinkClasses = "!text-onSurface font-bold";
  const inactiveLinkClasses = "";

  return (
    <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-lg border-b border-outline/20">
      <nav className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-onSurface">
            <SparklesIcon className="w-7 h-7" />
            <span>灵感流</span>
          </NavLink>
          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              信息流
            </NavLink>
            <NavLink
              to="/personas"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
                角色
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;