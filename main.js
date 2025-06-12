 /****************************************************************************************************
     * EN: Virtual Study Room Webapp
     * IT: Webapp Virtual Study Room
     * --------------------------------------------------------------------------------------------------
     * EN: This webapp simulates a virtual study room with basic collaboration features.
     *     - A user can join a room by entering a room name.
     *     - The app displays a list of active students (simulated using the Random User API).
     *     - A study timer is provided to track study time.
     *     - A simple chat area allows sending messages (messages are stored locally).
     *
     * IT: Questa webapp simula una "Virtual Study Room" con funzionalità di collaborazione base.
     *     - L'utente può unirsi a una stanza inserendo un nome di stanza.
     *     - L'app visualizza una lista di studenti attivi (simulata usando la Random User API).
     *     - Viene fornito un timer di studio per tenere traccia del tempo di studio.
     *     - Un'area chat semplice permette di inviare messaggi (i messaggi sono salvati localmente).
     ****************************************************************************************************/
    
    // ---------------------------
    // Global Variables
    // ---------------------------
    let studyTimerInterval = null;
    let elapsedSeconds = 0;
    let chatMessages = []; // Store chat messages locally
    
    // ---------------------------
    // DOM Elements for Room Join and Study Room
    // ---------------------------
    const joinRoomSection = document.getElementById("joinRoomSection");
    const roomNameInput = document.getElementById("roomName");
    const joinRoomBtn = document.getElementById("joinRoomBtn");
    const studyRoom = document.getElementById("studyRoom");
    const currentRoomName = document.getElementById("currentRoomName");
    
    // ---------------------------
    // Active Users Elements
    // ---------------------------
    const activeUsersDiv = document.getElementById("activeUsers");
    const refreshUsersBtn = document.getElementById("refreshUsersBtn");
    
    // ---------------------------
    // Timer Elements
    // ---------------------------
    const timerDisplay = document.getElementById("timerDisplay");
    const startTimerBtn = document.getElementById("startTimerBtn");
    const pauseTimerBtn = document.getElementById("pauseTimerBtn");
    const resetTimerBtn = document.getElementById("resetTimerBtn");
    
    // ---------------------------
    // Chat Elements
    // ---------------------------
    const chatMessagesDiv = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendChatBtn = document.getElementById("sendChatBtn");
    
    // ---------------------------
    // Join Room Handler
    // ---------------------------
    joinRoomBtn.addEventListener("click", () => {
      const roomName = roomNameInput.value.trim();
      if (!roomName) {
        alert("Please enter a room name.");
        return;
      }
      // Hide join room section and show study room
      joinRoomSection.style.display = "none";
      studyRoom.style.display = "block";
      currentRoomName.textContent = "Room: " + roomName;
      // Load active users and clear previous chat messages
      loadActiveUsers();
      chatMessages = [];
      renderChatMessages();
      // Start the study timer from 0 (if not already running)
      resetTimer();
    });
    
    // ---------------------------
    // Active Users: Load simulated users from Random User API
    // ---------------------------
    async function loadActiveUsers() {
      activeUsersDiv.innerHTML = "Loading active students...";
      try {
        // Fetch 5 random users to simulate active students
        const response = await fetch("https://randomuser.me/api/?results=5");
        if (!response.ok) throw new Error("Network response not OK: " + response.status);
        const data = await response.json();
        renderActiveUsers(data.results);
      } catch (error) {
        console.error("Error loading active users:", error);
        activeUsersDiv.innerHTML = "Error loading active students.";
      }
    }
    
    function renderActiveUsers(users) {
      activeUsersDiv.innerHTML = "";
      users.forEach(user => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";
        const img = document.createElement("img");
        img.src = user.picture.thumbnail;
        img.alt = user.name.first;
        const nameSpan = document.createElement("span");
        nameSpan.textContent = user.name.first + " " + user.name.last;
        userCard.appendChild(img);
        userCard.appendChild(nameSpan);
        activeUsersDiv.appendChild(userCard);
      });
    }
    
    refreshUsersBtn.addEventListener("click", loadActiveUsers);
    
    // ---------------------------
    // Study Timer Functions
    // ---------------------------
    function formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2,"0")}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
    }
    
    function updateTimerDisplay() {
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }
    
    function startTimer() {
      if (studyTimerInterval) return; // Timer already running
      studyTimerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
      }, 1000);
    }
    
    function pauseTimer() {
      clearInterval(studyTimerInterval);
      studyTimerInterval = null;
    }
    
    function resetTimer() {
      pauseTimer();
      elapsedSeconds = 0;
      updateTimerDisplay();
    }
    
    startTimerBtn.addEventListener("click", startTimer);
    pauseTimerBtn.addEventListener("click", pauseTimer);
    resetTimerBtn.addEventListener("click", resetTimer);
    
    // ---------------------------
    // Chat Functions
    // ---------------------------
    function renderChatMessages() {
      chatMessagesDiv.innerHTML = "";
      if (chatMessages.length === 0) {
        chatMessagesDiv.innerHTML = "<p class='text-center text-muted'>No messages yet.</p>";
        return;
      }
      chatMessages.forEach(msg => {
        const messageDiv = document.createElement("div");
        messageDiv.className = "chat-message";
        messageDiv.textContent = msg;
        chatMessagesDiv.appendChild(messageDiv);
      });
      // Scroll chat to bottom
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
    
    sendChatBtn.addEventListener("click", () => {
      const message = chatInput.value.trim();
      if (!message) return;
      // In a real app, we would broadcast the message.
      // Here we simply add it locally.
      chatMessages.push(message);
      chatInput.value = "";
      renderChatMessages();
    });
    
    chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChatBtn.click();
      }
    });
    
    // ---------------------------
    // Full-Screen Modal for Study Room (optional, e.g. for showing a resource image)
    // (In this prototype, we use it to display a larger view of a study tip image if available)
    // ---------------------------
    // (This example modal is not used actively in this prototype. It can be extended as needed.)
    // ---------------------------
    
    // ---------------------------
    // INITIALIZATION
    // ---------------------------
    // When the page loads, the join room section is visible.
    // The timer, chat and active users will be initialized when joining a room.
    
