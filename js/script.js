// Active nav links
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

function setActiveLink() {
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop - 120 &&
      window.scrollY < sectionTop + sectionHeight - 120
    ) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();

// Change theme
const themeToggleBtn = document.getElementById("themeToggleBtn");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    if (themeToggleBtn) themeToggleBtn.textContent = "☀️ ";
  } else {
    document.body.classList.remove("dark");
    if (themeToggleBtn) themeToggleBtn.textContent = "🌙 ";
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
}

// Project filtering + sorting
const projectSearch = document.getElementById("projectSearch");
const projectsContainer = document.getElementById("projectsContainer");
const projectsEmptyState = document.getElementById("projectsEmptyState");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectSort = document.getElementById("projectSort");

let currentFilter = "all";

function updateProjects() {
  if (!projectsContainer) return;

  const cards = Array.from(projectsContainer.querySelectorAll(".project-card"));
  const searchTerm = projectSearch ? projectSearch.value.trim().toLowerCase() : "";
  const sortValue = projectSort ? projectSort.value : "default";

  let visibleCount = 0;

  cards.forEach((card) => {
    const title = (card.getAttribute("data-title") || "").toLowerCase();
    const category = (card.getAttribute("data-category") || "").toLowerCase();

    const matchesSearch = title.includes(searchTerm);
    const matchesFilter =
      currentFilter === "all" || category.includes(currentFilter);

    const shouldShow = matchesSearch && matchesFilter;

    card.style.display = shouldShow ? "" : "none";

    if (shouldShow) visibleCount++;
  });

  const visibleCards = cards.filter((card) => card.style.display !== "none");

  if (sortValue === "az") {
    visibleCards.sort((a, b) => {
      const aTitle = a.querySelector("h3").textContent.toLowerCase();
      const bTitle = b.querySelector("h3").textContent.toLowerCase();
      return aTitle.localeCompare(bTitle);
    });
  } else if (sortValue === "za") {
    visibleCards.sort((a, b) => {
      const aTitle = a.querySelector("h3").textContent.toLowerCase();
      const bTitle = b.querySelector("h3").textContent.toLowerCase();
      return bTitle.localeCompare(aTitle);
    });
  }

  visibleCards.forEach((card) => projectsContainer.appendChild(card));

  if (projectsEmptyState) {
    projectsEmptyState.classList.toggle("hidden", visibleCount !== 0);
  }
}

if (projectSearch) {
  projectSearch.addEventListener("input", updateProjects);
}

if (projectSort) {
  projectSort.addEventListener("change", updateProjects);
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
      button.classList.add("active-filter");
      currentFilter = button.getAttribute("data-filter");
      updateProjects();
    });
  });
}

updateProjects();

// API fetch
const newsBtn = document.getElementById("newsBtn");
const newsLoading = document.getElementById("newsLoading");
const newsError = document.getElementById("newsError");
const newsResult = document.getElementById("newsResult");

async function fetchNews() {
  if (!newsBtn || !newsLoading || !newsError || !newsResult) return;

  newsError.classList.add("hidden");
  newsError.textContent = "";
  newsResult.innerHTML = "";
  newsLoading.classList.remove("hidden");

  try {
    const response = await fetch(
      "https://dev.to/api/articles?tags=ai,webdev,javascript,frontend&per_page=20"
    );

    if (!response.ok) {
      throw new Error("Failed to load insights. Please try again.");
    }

    const data = await response.json();

    if (!data.length) {
      throw new Error("No insights found at the moment.");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const article = data[randomIndex];

    newsResult.innerHTML = `
      <h3>${article.title}</h3>
      <p class="muted">Author: ${article.user.name}</p>
      <p class="muted">Tags: ${article.tags}</p>
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">
        <button type="button">Read More</button>
      </a>
    `;
  } catch (error) {
    newsError.textContent = error.message;
    newsError.classList.remove("hidden");
  } finally {
    newsLoading.classList.add("hidden");
  }
}

if (newsBtn) {
  newsBtn.addEventListener("click", fetchNews);
}

// Contact form validation
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const formSuccess = document.getElementById("formSuccess");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");
}

function hideError(element) {
  element.textContent = "";
  element.classList.add("hidden");
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    hideError(nameError);
    hideError(emailError);
    hideError(messageError);
    formSuccess.classList.add("hidden");

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    let hasError = false;

    if (!nameValue) {
      showError(nameError, "Name is required.");
      hasError = true;
    }

    if (!emailValue) {
      showError(emailError, "Email is required.");
      hasError = true;
    } else if (!isValidEmail(emailValue)) {
      showError(emailError, "Please enter a valid email address.");
      hasError = true;
    }

    if (!messageValue) {
      showError(messageError, "Message is required.");
      hasError = true;
    }

    if (hasError) return;

    formSuccess.classList.remove("hidden");
    formSuccess.classList.add("fade-in");
    contactForm.reset();
  });
}