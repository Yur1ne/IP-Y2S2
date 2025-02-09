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


export default Navigation;

function scrollTestimonials(direction) {
    const container = document.querySelector(".testimonials-container");
    const scrollAmount = 350; // Adjust as needed
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}

// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// Toggle hamburger menu
hamburger.addEventListener('click', () => {
    // Toggle hamburger animation
    hamburger.classList.toggle('active');
    // Toggle navigation menu
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
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

// Add smooth scrolling to nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Testimonials Navigation
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    
    const cardsPerPage = getCardsPerPage();
    let currentPage = 0;
    const totalPages = Math.ceil(testimonialCards.length / cardsPerPage);

    function getCardsPerPage() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    function updateTestimonials() {
        // Hide all cards
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });

        // Show cards for current page
        const startIndex = currentPage * cardsPerPage;
        const endIndex = Math.min(startIndex + cardsPerPage, testimonialCards.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            testimonialCards[i].classList.add('active');
        }

        // Update button states
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage >= totalPages - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateTestimonials();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateTestimonials();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardsPerPage = getCardsPerPage();
        if (newCardsPerPage !== cardsPerPage) {
            currentPage = 0;
            updateTestimonials();
        }
    });

    // Initialize the display
    updateTestimonials();
});