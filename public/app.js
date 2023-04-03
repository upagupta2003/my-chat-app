// app.js
document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  });
  
  // Add event listeners for send and voice buttons, and handle API requests
const sendButton = document.getElementById('send-button');
const voiceButton = document.getElementById('voice-button');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// Function to handle API requests
async function sendRequest(text) {
  // Replace this with your own API endpoint
  const apiUrl = 'http://localhost:3001/api/generate-response';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

sendButton.addEventListener('click', async () => {
  const text = userInput.value;
  if (!text) return;

  // Send the user's input to the GPT-3 API and display the response
  const response = await sendRequest(text);
  chatWindow.innerHTML += `<p><strong>User:</strong> ${text}</p>`;
  chatWindow.innerHTML += `<p><strong>Bot:</strong> ${response.message}</p>`;
  userInput.value = '';
});

// Add the event listener for the voice button and integrate voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

voiceButton.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', async (event) => {
  const text = event.results[0][0].transcript;
  const response = await sendRequest(text);

  chatWindow.innerHTML += `<p><strong>User (Voice):</strong> ${text}</p>`;
  chatWindow.innerHTML += `<p><strong>Bot:</strong> ${response.message}</p>`;
});

recognition.addEventListener('error', (event) => {
  console.error('Error:', event.error);
});
