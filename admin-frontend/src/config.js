// src/config.js
import { initializeApp } from 'firebase/app';

// ⚠️ IMPORTANT: Replace these with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhgsT6lEgV_5ap1L7--HNSrnb3qlyjTyg",
    authDomain: "project-8812136035477954307.firebaseapp.com",
    projectId: "project-8812136035477954307",
    storageBucket: "project-8812136035477954307.firebasestorage.app",
    messagingSenderId: "521384541472",
    appId: "1:521384541472:web:248d25b4ff8af47e672b45",
    databaseURL: "https://project-8812136035477954307-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);