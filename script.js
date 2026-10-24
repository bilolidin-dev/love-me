const questionContainer = document.querySelector(".question-container");
const resultContainer = document.querySelector(".result-container");
const gifResult = document.querySelector(".gif-result");
const heartLoader = document.querySelector(".cssload-main");
const yesBtn = document.querySelector(".js-yes-btn");
const noBtn = document.querySelector(".js-no-btn");
const languageButtons = document.querySelectorAll(".language-button");
const question = document.querySelector(".question");
const resultMessage = document.querySelector(".result-container h2");
const creatorContainer = document.querySelector(".creator-container");
const creatorForm = document.querySelector(".creator-form");
const recipientNameInput = document.querySelector(".name-input");
const shareLinkContainer = document.querySelector(".share-link");
const shareUrlInput = document.querySelector(".share-url");
const copyLinkButton = document.querySelector(".copy-link-button");
const copyStatus = document.querySelector(".copy-status");
const query = new URLSearchParams(window.location.search);
const recipientName = query.get("to")?.trim().slice(0, 40) || "";
let currentLanguage;

const translations = {
  ru: {
    title: "Ты меня любишь?",
    question: "ты меня любишь?",
    yes: "Да",
    no: "Нет",
    result: "Я так и знала!😍",
    languageLabel: "Выбор языка",
    creatorTitle: "Создай валентинку",
    creatorCopy: "Один вопрос. Одно имя. И немного смелости.",
    nameLabel: "Имя любимого человека",
    namePlaceholder: "Например, Алина",
    createLink: "Создать ссылку",
    linkLabel: "Отправь эту ссылку:",
    copy: "Копировать",
    copied: "Ссылка скопирована",
    copyFallback: "Выдели и скопируй ссылку",
    nameRequired: "Введи имя, чтобы создать ссылку",
    personalizedQuestion: (name) => `${name}, ты меня любишь?`,
  },
  ky: {
    title: "Сен мени сүйөсүңбү?",
    question: "сен мени сүйөсүңбү?",
    yes: "Ооба",
    no: "Жок",
    result: "Мен билгем!😍",
    languageLabel: "Тил тандоо",
    creatorTitle: "Валентинка түз",
    creatorCopy: "Бир суроо. Бир ысым. Жана бир аз кайрат.",
    nameLabel: "Сүйүктүү адамыңдын аты",
    namePlaceholder: "Мисалы, Айдана",
    createLink: "Шилтеме түзүү",
    linkLabel: "Бул шилтемени жөнөт:",
    copy: "Көчүрүү",
    copied: "Шилтеме көчүрүлдү",
    copyFallback: "Шилтемени белгилеп көчүр",
    nameRequired: "Шилтеме түзүү үчүн атын жаз",
    personalizedQuestion: (name) => `${name}, сен мени сүйөсүңбү?`,
  },
  en: {
    title: "Do you love me?",
    question: "do you love me?",
    yes: "Yes",
    no: "No",
    result: "I knew it!😍",
    languageLabel: "Choose language",
    creatorTitle: "Create a Valentine",
    creatorCopy: "One question. One name. A little courage.",
    nameLabel: "Your favorite person's name",
    namePlaceholder: "For example, Alex",
    createLink: "Create link",
    linkLabel: "Send this link:",
    copy: "Copy",
    copied: "Link copied",
    copyFallback: "Select and copy the link",
    nameRequired: "Enter a name to create a link",
    personalizedQuestion: (name) => `${name}, do you love me?`,
  },
};

const setLanguage = (language) => {
  const translation = translations[language];
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = translation.title;
  question.textContent = recipientName
    ? translation.personalizedQuestion(recipientName)
    : translation.question;
  yesBtn.textContent = translation.yes;
  noBtn.textContent = translation.no;
  resultMessage.textContent = translation.result;
  document.querySelector(".language-switch").setAttribute("aria-label", translation.languageLabel);
  document.querySelector(".creator-title").textContent = translation.creatorTitle;
  document.querySelector(".creator-copy").textContent = translation.creatorCopy;
  document.querySelector(".name-label").textContent = translation.nameLabel;
  recipientNameInput.placeholder = translation.namePlaceholder;
  document.querySelector(".create-link-button").textContent = translation.createLink;
  document.querySelector(".link-label").textContent = translation.linkLabel;
  copyLinkButton.textContent = translation.copy;
  copyLinkButton.setAttribute("aria-label", translation.copy);
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  localStorage.setItem("love-page-language", language);
};

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

const requestedLanguage = query.get("lang");
const savedLanguage = localStorage.getItem("love-page-language");
setLanguage(translations[requestedLanguage] ? requestedLanguage : (savedLanguage || "ru"));

if (recipientName) {
  creatorContainer.hidden = true;
} else {
  questionContainer.hidden = true;
  resultContainer.hidden = true;
}

creatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = recipientNameInput.value.trim().replace(/\s+/g, " ");

  if (!name) {
    recipientNameInput.setCustomValidity(translations[currentLanguage].nameRequired);
    recipientNameInput.reportValidity();
    return;
  }

  recipientNameInput.setCustomValidity("");
  const shareUrl = new URL(window.location.href);
  shareUrl.search = "";
  shareUrl.searchParams.set("to", name);
  shareUrl.searchParams.set("lang", currentLanguage);
  shareUrlInput.value = shareUrl.toString();
  shareLinkContainer.hidden = false;
  copyStatus.textContent = "";
});

recipientNameInput.addEventListener("input", () => recipientNameInput.setCustomValidity(""));

copyLinkButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareUrlInput.value);
    copyStatus.textContent = translations[currentLanguage].copied;
  } catch {
    shareUrlInput.select();
    copyStatus.textContent = translations[currentLanguage].copyFallback;
  }
});

const buttonContainer = document.querySelector(".button-container");

const moveNoButton = () => {
  const minX = yesBtn.offsetLeft + yesBtn.offsetWidth;
  const maxX = buttonContainer.clientWidth - noBtn.offsetWidth;
  const maxY = Math.max(0, buttonContainer.clientHeight - noBtn.offsetHeight);

  const newX = maxX >= minX
    ? minX + Math.floor(Math.random() * (maxX - minX + 1))
    : Math.max(0, yesBtn.offsetLeft - noBtn.offsetWidth);

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${Math.floor(Math.random() * (maxY + 1))}px`;
};

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: true });

// yes button functionality

yesBtn.addEventListener("click", () => {
  questionContainer.style.display = "none";
  heartLoader.style.display = "inherit";

  setTimeout(() => {
    heartLoader.style.display = "none";
    resultContainer.style.display = "inherit";
    gifResult.play();
  }, 3000);
});