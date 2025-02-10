import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// *** CHANGE THIS TO YOUR OWN PATH!!!
const players = ref(db, "players");

const supabaseUrl = "https://mjnybiaabxdhlsygnpdf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbnliaWFhYnhkaGxzeWducGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzY2MzEsImV4cCI6MjA1NDc1MjYzMX0.PtVhJhKdMEHqO2ukXFjfmNS_6l0p5Q2Fcvg67TMremM";

// Create a single supabase client for interacting with your database
// *** I CHANGED THIS from '_supabase' to 'client'
const client = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Get the video element
const video = document.getElementById("webcam");

// Get the capture button
const captureButton = document.getElementById("captureButton");
// When the capture button is clicked, call capturePhoto() function
captureButton.addEventListener("click", capturePhoto);

// Get the upload button
const uploadButton = document.getElementById("uploadButton");
// When the upload button is clicked, call uploadToSupabase() function
uploadButton.addEventListener("click", uploadToSupabase);

// When the page is fully loaded, call startWebcam() function
window.addEventListener("load", startWebcam);

// Get the canvas and the 2d context
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Used to store the captured image data to be used later in uploadToSupabase
let imageData;

// Start the webcam
async function startWebcam() {
  try {
    // Get the webcam video stream from the browser
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Display webcam feed
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing webcam, check permissions:", error);
  }
}

// Capture the photo from video feed to canvas
function capturePhoto() {
  // Take the current frame from the video, and copy it to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Take the image in the canvas, and convert it to a PNG image base64 string
  imageData = canvas.toDataURL("image/png");

  // Enable the upload button
  uploadButton.disabled = false;
  alert("Photo captured!");
}

// Upload captured photo in the canvas to Supabase
async function uploadToSupabase() {
  if (!imageData) {
    alert("No photo captured!");
    return;
  }

  // Converting base64 image to a binary blob
  const blob = await fetch(imageData).then((res) => res.blob());
  console.log(blob);

  // Create a unique file name using the timestamp
  const fileName = `webcam/${Date.now()}.png`;
  console.log(fileName);

  try {
    // Upload to Supabase Storage
    // *** I CHANGED '_supabase' to 'client'
    const { data, error } = await client.storage
      .from("images")
      .upload(fileName, blob);

    if (error) {
      console.error(error);
      throw error;
    }

    // Get public URL of the uploaded image
    const publicUrlData = client.storage.from("images").getPublicUrl(fileName);
    const publicUrl = publicUrlData.data.publicUrl;

    // Store the public URL to your user's profile in Firebase
    // *** REPLACE 'players' with your Firebase database path
    // *** REPLACE '"detach8"' with your login userid
    set(child(players, "detach8"), { image: publicUrl });
  } catch (error) {
    // *** I CHANGED this to alert
    alert("Error uploading photo:", error.message);
  }
}