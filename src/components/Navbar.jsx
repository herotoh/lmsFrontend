import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
    </nav>
  );
};

export default Navbar;
