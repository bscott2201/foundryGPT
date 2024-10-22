// OpenAI API key (replace this with your actual key)
const API_KEY = "sk-svcacct-BR9sEAxGQrJbEZnISKdeAJXUev_KOAh5U09M1rXVUhLCyYMA1icYbD3263wjT3BlbkFJkgjdO1p9seBSh9ZRaQ7-pk3VIDHIrJDc7ZIMhlajRswVQsfwIEVWnra6NJ4A";

// Function to send a message to ChatGPT and get a response
async function sendMessageToGPT(message) {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo", // You can change this to another GPT model if desired
      messages: [{ role: "user", content: message }],
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    const reply = response.data.choices[0].message.content;
    return reply;
  } catch (error) {
    console.error("Error sending message to GPT: ", error);
    return "Sorry, there was an error connecting to ChatGPT.";
  }
}

// Initialize the module once Foundry VTT is ready
Hooks.on('ready', () => {
  console.log("Foundry OpenAI Chat module loaded");

  // Add a button to the chat log for interacting with ChatGPT
  Hooks.on('renderChatLog', (app, html, data) => {
    const button = $(`<button class="openai-chat-btn">Chat with GPT</button>`);
    button.click(() => openChatWindow());
    html.append(button);
  });
});

// Function to open the chat dialog window
function openChatWindow() {
  const dialog = new Dialog({
    title: "Chat with GPT",
    content: `
      <div class="gpt-chat-container">
        <textarea id="gpt-chat-input" placeholder="Ask GPT something..." rows="4"></textarea>
        <div id="gpt-chat-output"></div>
      </div>
    `,
    buttons: {
      send: {
        label: "Send",
        callback: async () => {
          const message = document.getElementById("gpt-chat-input").value;
          if (!message) return;
          const response = await sendMessageToGPT(message);
          document.getElementById("gpt-chat-output").innerHTML = `<p>${response}</p>`;
        }
      }
    },
    render: html => {
      console.log("Chat window opened.");
    },
    close: () => console.log("Chat window closed.")
  });
  dialog.render(true);
}