"use strict";
import entries from "./entries.js";

if (window.location.href.endsWith("/" || "index.html")) {
  const submitEntryBtn = document.getElementById("submit-entry");
  submitEntryBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const emotion = document.querySelector("input[name='emotion']:checked");
    const content = document.querySelector("input[name='content']");

    if (content.value && emotion) createEntry(content.value, emotion);

    document.getElementById("entry-form").reset();
  });
}

if (window.location.href.endsWith("emoticon.html")) {
  const addEmotionBtn = document.getElementById("add-emotion");
  addEmotionBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const emotionName = document.querySelector("input[name='emotion-name']");
    const emotionImg = document.querySelector(
      "input[name='emotion-image']:checked"
    );

    if (emotionName.value && emotionImg)
      createEmotion(emotionName.value, emotionImg);

    document.getElementById("emotion-form").reset();
  });
}

const loadEmotions = () => {
  const emotionsContainer = document.querySelector(".entry__emotions-list");
  emotionsContainer.textContent = "Loading";

  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      emotionsContainer.replaceChildren();
      const response = JSON.parse(httpRequest.responseText);

      for (let emotion of response) {
        const emotionsListItem = document.createElement("div");
        emotionsListItem.classList.add("emotions__list-item");

        const emotionRadio = document.createElement("input");
        emotionRadio.setAttribute("type", "radio");
        emotionRadio.setAttribute("name", "emotion");
        emotionRadio.setAttribute("value", emotion.id);
        emotionRadio.setAttribute("id", emotion.name);

        const emotionLabel = document.createElement("label");
        emotionLabel.setAttribute("for", emotion.name);
        emotionLabel.textContent = emotion.name;

        emotionsListItem.append(emotionRadio, emotionLabel);
        emotionsContainer.appendChild(emotionsListItem);
      }
    }
  };

  httpRequest.open("GET", "./service/emotion_service.php");
  httpRequest.send();
};

const loadEntries = () => {
  const blogEntriesContainer = document.querySelector(".blog__entries");
  blogEntriesContainer.replaceChildren();

  const blogEntriesText = document.createTextNode("Loading");

  const blogEntriesMessage = document.createElement("div");
  blogEntriesMessage.classList.add("blog__entries-message");
  blogEntriesMessage.appendChild(blogEntriesText);
  blogEntriesContainer.appendChild(blogEntriesMessage);

  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      const response = JSON.parse(httpRequest.responseText);

      if (response.length == 0) blogEntriesText.nodeValue = "No entries";
      else blogEntriesText.nodeValue = "";

      for (let entry of response)
        blogEntriesContainer.appendChild(logEntryItem(entry));
    }
  };

  httpRequest.open("GET", "./service/entry_service.php");
  httpRequest.send();
};

const updateEntries = () => {
  // TODO
};

const createEntry = (content, emotion) => {
  const blogEntriesContainer = document.querySelector(".blog__entries");
  const httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = () => {
    // Process server response
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      const response = JSON.parse(httpRequest.responseText);
      const entryItemContainer = logEntryItem(response);
      blogEntriesContainer.insertBefore(
        entryItemContainer,
        blogEntriesContainer.firstChild
      );
    }
  };

  httpRequest.open(
    "POST",
    `./service/entry_service.php?c=${content}&e=${emotion.value}`
  );

  httpRequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  httpRequest.send();
};

const createEmotion = (name, image) => {
  const httpRequest = new XMLHttpRequest();
  httpRequest.open(
    "POST",
    `./service/emotion_service.php?n=${name}&i=${image.value}`
  );

  httpRequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  httpRequest.send();
};

const logEntryItem = (entry) => {
  const entryItemContainer = document.createElement("div");
  entryItemContainer.classList.add("blog__entry-item");

  const entryContentContainer = document.createElement("div");
  entryContentContainer.classList.add("entry__item-content");

  const entryHeaderContainer = document.createElement("div");
  const entryHeaderText = document.createElement("h3");
  const contentText = document.createTextNode(entry.content);
  entryHeaderText.appendChild(contentText);
  entryHeaderContainer.appendChild(entryHeaderText);

  const entryDateTimeContainer = document.createElement("div");
  entryDateTimeContainer.classList.add("entry__item-datetime");
  const dateTimeText = document.createTextNode(entry.posted);
  entryDateTimeContainer.appendChild(dateTimeText);

  entryContentContainer.append(entryHeaderContainer, entryDateTimeContainer);
  entryItemContainer.appendChild(entryContentContainer);

  const entryObject = {
    id: +entry.id,
    content: entry.content,
    posted: entry.posted,
  };

  if (entry.emotionName) {
    const entryEmotionContainer = document.createElement("div");
    entryEmotionContainer.classList.add("entry__item-emotion");
    entryContentContainer.insertBefore(
      entryEmotionContainer,
      entryDateTimeContainer
    );

    const entryEmotionText = document.createTextNode(
      `Feeling ${entry.emotionName.toLowerCase()}`
    );
    entryEmotionContainer.appendChild(entryEmotionText);

    entryObject.emotionName = entry.emotionName;
  }

  if (entry.emotionImg) {
    const entryImgContainer = document.createElement("div");
    entryImgContainer.classList.add("entry__item-img");
    entryItemContainer.insertBefore(entryImgContainer, entryContentContainer);

    const entryEmotionImg = new Image();
    entryEmotionImg.onerror = () => {
      entryEmotionImg.src = "";
      entryEmotionImg.alt = "";
      entryEmotionImg.title = "";
      entryItemContainer.removeChild(entryImgContainer);
    };

    entryEmotionImg.src = `./app/res/emotion-images/${entry.emotionImg}`;
    entryEmotionImg.alt = `Feeling ${entry.emotionName.toLowerCase()}`;
    entryEmotionImg.title = `Feeling ${entry.emotionName.toLowerCase()}`;
    entryImgContainer.appendChild(entryEmotionImg);

    entryObject.emotionImg = entry.emotionImg;
  }

  entries.push(entryObject);
  return entryItemContainer;
};

window.onload = () => {
  loadEmotions();
  loadEntries();
  setInterval(updateEntries, 5000);
};
