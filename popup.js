// Toggle View based on actions
function toggleView(state) {
    document.getElementById("welcome-screen").style.display = (state === "welcome") ? "block" : "none";
    document.getElementById("user-registration").style.display = (state === "registration") ? "block" : "none";
    document.getElementById("user-selection").style.display = (state === "selectUser") ? "block" : "none";
    document.getElementById("info").style.display = (state === "showInfo") ? "block" : "none";
  }
  
  // Register button in welcome screen
function RegistrationButton() {
    toggleView("registration");
  }
  
  // Select User button in welcome screen
function SelectUserButton() {
    toggleView("selectUser");
    loadUserList(); // Load users into dropdown when showing the selection screen
  }
  
  // Back button in registration screen
function GoBackButton() {
    toggleView("welcome");
  }
  // Function to register a new user
function registerUser() {
    const username = document.getElementById("new-username").value;
    if (!username) return;
  
    // Add user to the list in Chrome storage
    chrome.storage.sync.get({ users: {} }, function (data) {
      const users = data.users;
      if (!users[username]) {
        users[username] = {}; // Create an empty profile for the new user
        chrome.storage.sync.set({ users }, function () {
          document.getElementById("new-username").value = ""; // Clear input field
          toggleView("welcome"); // Return to welcome screen after registration
        });
      }
    });
  } 
  // Function to load users into dropdown
function loadUserList() {
    chrome.storage.sync.get({ users: {} }, function (data) {
      const userList = document.getElementById("user-list");
      userList.innerHTML = '<option value="" disabled selected>Select user</option>'; // Reset list
      for (const username in data.users) {
        const option = document.createElement("option");
        option.value = username;
        option.textContent = username;
        userList.appendChild(option);
      }
    });
  }
  
  // Load data for the selected user and show data fields
function onUserListChange(event) {
    const username = event.target.value;
    if (username) {
      toggleView("showInfo");
      chrome.storage.sync.get({ users: {} }, function (data) {
        const userData = data.users[username] || {};
        document.getElementById("name").value = userData.name || "";
        document.getElementById("experience").value = userData.experience || "";
        document.getElementById("education").value = userData.education || "";
        document.getElementById("skills").value = userData.skills || "";
        chrome.storage.sync.set({ selectedUser: username }); // Save the selected user
      });
    }
  }
  // Save data for the selected user
function saveUserData() {
    const selectedUser = document.getElementById("user-list").value;
    if (!selectedUser) return;
  
    const userData = {
      name: document.getElementById("name").value,
      experience: document.getElementById("experience").value,
      education: document.getElementById("education").value,
      skills: document.getElementById("skills").value
    };
  
    chrome.storage.sync.get({ users: {} }, function (data) {
      data.users[selectedUser] = userData;
      chrome.storage.sync.set({ users: data.users });
    });
  }
  
  // Clear data for the selected user
function clearUserData() {
    document.getElementById("name").value = "";
    document.getElementById("experience").value = "";
    document.getElementById("education").value = "";
    document.getElementById("skills").value = "";
  
    const selectedUser = document.getElementById("user-list").value;
    chrome.storage.sync.get({ users: {} }, function (data) {
      if (selectedUser) {
        data.users[selectedUser] = {}; // Clear data fields for this user
        chrome.storage.sync.set({ users: data.users });
      }
    });
  }
    // Delete user and their data
function deleteUser() {
        const selectedUser = document.getElementById("user-list").value;
        chrome.storage.sync.get({ users: {} }, function (data) {
          if (selectedUser) {
            delete data.users[selectedUser]; // Delete the user
            chrome.storage.sync.set({ users: data.users }, function () {
              toggleView("welcome"); // Return to welcome screen
            });
          }
        });
    }
function changeUser() {
        toggleView("selectUser");
      }   
  document.getElementById("clear-data").addEventListener("click", clearUserData);
  document.getElementById("change-user").addEventListener("click", changeUser);
  document.getElementById("delete-user").addEventListener("click", deleteUser);
  document.getElementById("user-list").addEventListener("change", onUserListChange);
  document.getElementById("select-user-option").addEventListener("click", SelectUserButton);
  document.getElementById("register-option").addEventListener("click", RegistrationButton);
  document.getElementById("save").addEventListener("click", saveUserData);
  document.getElementById("register-user").addEventListener("click", registerUser);
  document.querySelectorAll("#back-to-welcome").forEach(button => {
    button.addEventListener("click", GoBackButton);
  });
  

  