import { Link, useLocation } from 'react-router-dom';
import { Vote, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-lg bg-primary/10"
            >
              <Vote className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">
              Civic<span className="text-primary">Ledger</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/create"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/create') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Create Poll
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Info className="h-4 w-4" />
              How It Works
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
