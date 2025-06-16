import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import MemberProfile from './components/MemberProfile';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import BooksAvailable from './components/BooksAvailable';
import BorrowedBooks from './components/BorrowedBooks';
import AddBook from './components/AddBook';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import libraryImage from './assets/library.jpg';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Disclaimer from './components/Disclaimer';
import AdBanner from './components/AdBanner';

// Import social media icons
import facebookIcon from './assets/facebook-fill.svg';
import instagramIcon from './assets/instagram-fill.svg';
import twitterIcon from './assets/twitter-fill.svg';
import youtubeIcon from './assets/youtube-fill.svg';
import linkIcon from './assets/link-fill.svg'; // Assuming 'link-fill.svg' is the fifth icon

import './App.css';

function App() {
    return (
        <div className="App">
            {/* NEW: Social Media Icons Container */}

            <div className="social-icons-top-right">
                <div className="announcement-row">
                    <div className="announcement-text">
                        August 2025: Join us for the NDP Welcome Party, hosted by Chairman Wong Ah Heng. All Pioneer Generation members are invited to enjoy a free buffet in celebration. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;July 2025: The National Library will be organizing a Book Donation Campaign. We invite everyone to participate in this meaningful charity event. Let’s share the joy of reading—Happy Reading! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;July 15, 2025: Don’t miss our Book Fair at the Main Hall. The event is open to all members with special offers and literary showcases. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Coming Soon: The President will be our Guest of Honor at the upcoming Blood Donation Drive. Let’s come together to save lives—donate blood and make a difference! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We are pleased to announce that Donald Duck has proposed a new policy initiative granting tax exemption benefits to all foreign workers under specific employment categories. This initiative is aimed at encouraging international talent and boosting labor mobility.Eligible foreign workers may receive full tax waivers for a defined period, subject to official verification and documentation.Further details will be released by the respective tax authorities in due course. Please stay tuned for official updates and eligibility criteria.
                    </div>
                </div>

                <a href="#" target="/" rel="noopener noreferrer">
                    <img src={facebookIcon} alt="Facebook" className="social-icon" />
                </a>
                <a href="#" target="/" rel="noopener noreferrer">
                    <img src={instagramIcon} alt="Instagram" className="social-icon" />
                </a>
                <a href="#" target="/" rel="noopener noreferrer">
                    <img src={twitterIcon} alt="Twitter" className="social-icon" />
                </a>
                <a href="#" target="/" rel="noopener noreferrer">
                    <img src={youtubeIcon} alt="YouTube" className="social-icon" />
                </a>
                <a href="#" target="/" rel="noopener noreferrer">
                    <img src={linkIcon} alt="Link" className="social-icon" />
                </a>
            </div>

            <h1>Library Management System</h1>

            <Router>
                <Navbar />


                {/* This div will hold your main content, excluding the Navbar, AdBanner, and Footer */}
                <div className="main-content-layout">
                    <div className="main-routes-content">
                        <Routes>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/members/:id" element={<PrivateRoute><MemberDetails /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><MemberProfile /></PrivateRoute>} />
                            <Route path="/profile/:id" element={<PrivateRoute><MemberProfile /></PrivateRoute>} />
                            <Route path="/booksAvailable" element={<PrivateRoute><BooksAvailable /></PrivateRoute>} />
                            <Route path="/borrowedBooks" element={<PrivateRoute><BorrowedBooks /></PrivateRoute>} />
                            <Route path="/addBook" element={<PrivateRoute><AddBook /></PrivateRoute>} />
                            <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
                <AdBanner />
                <Footer />
            </Router>
        </div>
    );
}

// Home component remains the same
const Home = () => {
  return (
    <div>
      <h2>Library Management System V.3.8</h2>
      <img src={libraryImage} alt="Library" style={{ width: '100%', maxWidth: '600px', marginTop: '20px', borderRadius: '10px' }} />
    </div>
  );
};

export default App;