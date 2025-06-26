import { Link } from 'react-router-dom';


export default function Navigation() {
  

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl text-gray-900">
            Your App
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}
