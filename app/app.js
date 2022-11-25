"use strict";

window.onload = (e) => {
  loadEmotions();
  loadEntries();
};

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const emotion = document.querySelector("input[name='emotion']:checked");
  const content = document.querySelector("input[name='content']");
  if (content.value) createEntry(content.value, emotion);
  document.getElementById("entry-form").reset();
});

const loadEmotions = () => {
  const emotionsContainer = document.querySelector(".entry__emotions-list");
  emotionsContainer.textContent = "Loading";
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      emotionsContainer.replaceChildren();
      const emotions = JSON.parse(httpRequest.responseText);

      for (let emotion of emotions) {
        const emotionsListItem = document.createElement("div");
        emotionsListItem.classList.add("emotions__list-item");

        const emotionRadio = document.createElement("input");
        emotionRadio.setAttribute("type", "radio");
        emotionRadio.setAttribute("name", "emotion");
        emotionRadio.setAttribute("value", emotion.id);
        emotionRadio.setAttribute("id", emotion.emotion);

        const emotionLabel = document.createElement("label");
        emotionLabel.setAttribute("for", emotion.emotion);
        emotionLabel.textContent = emotion.emotion;

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
  const blogEntriesText = document.createTextNode("Loading");
  const blogEntriesMessage = document.createElement("div");
  blogEntriesMessage.classList.add("blog__entries-message");
  blogEntriesMessage.appendChild(blogEntriesText);
  blogEntriesContainer.appendChild(blogEntriesMessage);
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      const entries = JSON.parse(httpRequest.responseText);
      if (entries.length == 0) blogEntriesText.nodeValue = "No entries";
      else blogEntriesText.nodeValue = "";
      for (let entry of entries)
        blogEntriesContainer.appendChild(logEntryItem(entry));
    }
  };
  httpRequest.open("GET", "./service/entry_service.php");
  httpRequest.send();
};

const createEntry = (content, emotion = null) => {
  const blogEntriesContainer = document.querySelector(".blog__entries");
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    // Process server response
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      const entry = JSON.parse(httpRequest.responseText);
      console.log(entry);
      const entryItemContainer = logEntryItem(entry);
      blogEntriesContainer.insertBefore(
        entryItemContainer,
        blogEntriesContainer.firstChild
      );
    }
  };
  let serviceUrl = `./service/entry_service.php?c=${content}`;
  if (emotion) serviceUrl += `&e=${emotion.value}`;
  httpRequest.open("POST", serviceUrl);
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
  const dateTimeText = document.createTextNode(entry.datetime);
  entryDateTimeContainer.appendChild(dateTimeText);

  entryContentContainer.append(entryHeaderContainer, entryDateTimeContainer);
  entryItemContainer.appendChild(entryContentContainer);

  if (entry.emotion) {
    const entryEmotionContainer = document.createElement("div");
    entryEmotionContainer.classList.add("entry__item-emotion");
    entryContentContainer.insertBefore(
      entryEmotionContainer,
      entryDateTimeContainer
    );

    const entryEmotionText = document.createTextNode(
      `Feeling ${entry.emotion.toLowerCase()}`
    );
    entryEmotionContainer.appendChild(entryEmotionText);
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
    entryEmotionImg.src = `./res/emotion-images/${entry.emotionImg}`;
    entryEmotionImg.alt = `Feeling ${entry.emotion.toLowerCase()}`;
    entryEmotionImg.title = `Feeling ${entry.emotion.toLowerCase()}`;
    entryImgContainer.appendChild(entryEmotionImg);
  }

  return entryItemContainer;
};
