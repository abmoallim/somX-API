
function sendMessage() {
  var userMessage = $("#messageInput").val();
  if (userMessage.trim() === "") {
    return;
  }
  body = {
    prompt: userMessage,
  };
  console.log(body);
  $.ajax({
    url: "http://localhost:3000/ask",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(body),
    success: function (response) {
      appendMessage("user-message", userMessage);
      appendMessage("other-message", response.message);
      saveMessage(userMessage, response.message);
      $("#messageInput").val("");
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}


function appendMessage(className, message) {
  var chatContainer = $("#chatContainer");
  var messageBox = $("<div>")
    .addClass("chat-box " + className)
    .text(message);
  chatContainer.append(messageBox);

  chatContainer.scrollTop(chatContainer[0].scrollHeight);
}


function saveMessage(question, response) {
  var chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ question: question, response: response });

  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}
$(document).ready(function () {
  var chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach(function (message) {
    appendMessage("user-message", message.question);
    appendMessage("other-message", message.response);
  });
});
