const firebaseConfig = {
    apiKey: "AIzaSyAPqBbtP-KqLLVt0NcuVIKBDDz7jJa6Bak",
    authDomain: "ip-y2s2.firebaseapp.com",
    databaseURL: "https://ip-y2s2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ip-y2s2",
    storageBucket: "ip-y2s2.firebasestorage.app",
    messagingSenderId: "191631267863",
    appId: "1:191631267863:web:ada36be630772321afe452"
  };

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRealtime = getDatabase(app);
const dbFirestore = getFirestore(app);

// Sign Up Function
document.getElementById("sign-up-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value; // Added username field
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set displayName (username) in Firebase Authentication
        await updateProfile(user, {
            displayName: username
        });

        // Adding user data to Realtime Database
        const userRef = ref(dbRealtime, 'users/' + user.uid);
        await set(userRef, {
            email: user.email,
            uid: user.uid,
            username: username,
            createdAt: new Date().toISOString(),
        });

        console.log("User signed up and added to Realtime Database");

        // Redirect to Dashboard after successful sign-up
        window.location.href = "index.html"; // Make sure to have a dashboard.html page

    } catch (error) {
        console.error("Error signing up:", error);
        document.getElementById("user-info").innerHTML = "Error: " + error.message;
    }
});

// Sign In Function
document.getElementById("sign-in-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Redirect to Dashboard after successful sign-in
        window.location.href = "index.html"; // Make sure to have a dashboard.html page

    } catch (error) {
        console.error("Error signing in:", error);
        document.getElementById("user-info").innerHTML = "Error: " + error.message;
    }
});

// Sign Out Function
document.getElementById("sign-out-btn").addEventListener("click", async () => {
    await signOut(auth);
    document.getElementById("user-info").innerHTML = "You have signed out.";
    document.getElementById("sign-in-btn").style.display = "inline";
    document.getElementById("sign-out-btn").style.display = "none";
});

// Fetch Data from Realtime Database (on dashboard)
async function fetchRealtimeUserData() {
    const dbRef = ref(dbRealtime);
    try {
        const snapshot = await get(child(dbRef, 'users/' + auth.currentUser.uid));
        if (snapshot.exists()) {
            console.log("User Data from Realtime Database:", snapshot.val());
            document.getElementById("user-info").innerHTML = `Welcome, ${snapshot.val().username}`;
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch Data from Firestore
document.getElementById("fetch-firestore-btn").addEventListener("click", async () => {
    const querySnapshot = await getDocs(collection(dbFirestore, "users"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
});

// Fetch Data from Realtime Database
document.getElementById("fetch-realtime-btn").addEventListener("click", async () => {
    const dbRef = ref(dbRealtime);
    try {
        const snapshot = await get(child(dbRef, 'users'));
        if (snapshot.exists()) {
            console.log("Data from Realtime Database:", snapshot.val());
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// JavaScript to toggle navigation menu
// Place after your Firebase initialization and auth functions
// but before the profile button event listener

// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    // Toggle hamburger menu animation
    hamburger.classList.toggle('active');
    // Toggle navigation menu
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Your existing profile button event listener can stay at the bottom
document.querySelector('.profile-button').addEventListener('click', function() {
    console.log('Profile button clicked!');
});

document.querySelector('.profile-button').addEventListener('click', function() {
    console.log('Profile button clicked!');
});

function scrollTestimonials(direction) {
    const container = document.querySelector(".testimonials-container");
    const scrollAmount = 370; // Adjust as needed
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('section, .game-card');
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
});


import React, { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-200 to-purple-200 p-4 rounded-lg mx-auto max-w-[90%] sticky top-4 z-50 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 uppercase tracking-wider transform hover:scale-105 transition-transform">
          Number Quest
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#hero" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#games" className="nav-link">Games</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="/profile.html" className="bg-gradient-to-r from-pink-200 to-pink-300 px-4 py-2 rounded-lg font-semibold text-gray-800 shadow-md hover:scale-105 transition-all">
            Profile
          </a>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={`w-6 h-0.5 bg-gray-800 transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-center space-y-4 pt-4">
          <a href="#hero" className="nav-link w-full text-center" onClick={toggleMenu}>Home</a>
          <a href="#features" className="nav-link w-full text-center" onClick={toggleMenu}>Features</a>
          <a href="#games" className="nav-link w-full text-center" onClick={toggleMenu}>Games</a>
          <a href="#testimonials" className="nav-link w-full text-center" onClick={toggleMenu}>Testimonials</a>
          <a href="/profile.html" className="bg-gradient-to-r from-pink-200 to-pink-300 px-4 py-2 rounded-lg font-semibold text-gray-800 shadow-md hover:scale-105 transition-all w-full text-center">
            Profile
          </a>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          @apply text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-90 transition-colors relative;
        }
        
        .nav-link::after {
          content: '';
          @apply absolute w-0 h-0.5 bg-gray-800 bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-300;
        }
        
        .nav-link:hover::after {
          @apply w-full;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;