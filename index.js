// Firebase Configuration
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
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
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
    const username = document.getElementById("username").value;

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
        window.location.href = "index.html"; // Redirect to dashboard

    } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up: " + error.message); // Show error message to user
    }
});

// Sign In Function
document.getElementById("sign-in-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        window.location.href = "index.html"; // Redirect to dashboard

    } catch (error) {
        console.error("Error signing in:", error);
        alert("Error signing in: " + error.message); // Show error message to user
    }
});

// Sign Out Function
document.getElementById("sign-out-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("You have signed out."); // Show sign-out message
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Error signing out: " + error.message); // Show error message to user
    }
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
    try {
        const querySnapshot = await getDocs(collection(dbFirestore, "users"));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Error fetching Firestore data:", error);
    }
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