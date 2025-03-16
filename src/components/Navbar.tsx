import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">User Management</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${
                    isActive('/') 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/index"
                  className={`${
                    isActive('/index')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  User Details
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 