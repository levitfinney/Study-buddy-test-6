let conversation = JSON.parse(localStorage.getItem("memory")) || [];
let mode = "normal";

const knowledgeBase = {
  "mayan civilization": {
    summary: "The Mayan civilization was an ancient Mesoamerican culture known for writing, astronomy, and architecture.",
    details: "They lived in regions of Mexico and Central America. They built pyramids, developed a calendar system, and had advanced math knowledge including the concept of zero.",
    quiz: [
      "Where did the Mayans live?",
      "What was one major achievement of the Mayans?"
    ]
  },
  "ancient egypt": {
    summary: "Ancient Egypt was a civilization along the Nile River, known for pyramids, pharaohs, and hieroglyphics.",
    details: "They developed complex religious beliefs, built massive monuments, and created early writing systems.",
    quiz: [
      "What river was central to Ancient Egypt?",
      "Name one famous type of Egyptian structure."
    ]
  }
};

function saveMemory() { localStorage.setItem("memory", JSON.stringify(conversation)); }

function setMode(newMode) { mode = newMode; }

function clearMemory() {
  conversation = [];
  localStorage.removeItem("memory");
  document.getElementById("chat").innerHTML = "";
}

function addMessage(role, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p class="${role}"><b>${role}:</b> ${text}</p>`;
  chat.scrollTop = chat.scrollHeight;
}

function aiRespond(input) {
  const topic = input.toLowerCase();
  if (knowledgeBase[topic]) {
    let data = knowledgeBase[topic];
    if (mode === "simple") return data.summary;
    if (mode === "deep") return data.summary + " " + data.details;
    return data.summary + " " + data.details;
  }
  return "I don't have info on that topic yet, try another one!";
}

function generateQuiz() {
  let lastTopic = conversation.reverse().find(m => m.role === "user");
  if (!lastTopic) return addMessage("ai", "Ask about a topic first to generate a quiz.");

  let topic = lastTopic.content.toLowerCase();
  if (knowledgeBase[topic] && knowledgeBase[topic].quiz) {
    let quiz = knowledgeBase[topic].quiz.map(q => `- ${q}`).join("<br>");
    addMessage("ai", `Quiz for ${topic}:<br>${quiz}`);
  } else {
    addMessage("ai", "No quiz available for this topic.");
  }
}

function sendMessage() {
  const inputBox = document.getElementById("userInput");
  const message = inputBox.value;
  inputBox.value = "";

  addMessage("user", message);
  conversation.push({ role: "user", content: message });

  const reply = aiRespond(message);
  addMessage("ai", reply);
  conversation.push({ role: "assistant", content: reply });

  saveMemory();
}
