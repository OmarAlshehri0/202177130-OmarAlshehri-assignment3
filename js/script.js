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
    if (themeToggleBtn) themeToggleBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    if (themeToggleBtn) themeToggleBtn.textContent = "🌙";
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
    const matchesFilter = currentFilter === "all" || category.includes(currentFilter);

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

//pexels API 
const inspirationBtn = document.getElementById("inspirationBtn");
const inspirationLoading = document.getElementById("inspirationLoading");
const inspirationError = document.getElementById("inspirationError");

const inspirationEmpty = document.getElementById("inspirationEmpty");

const inspirationGrid = document.getElementById("inspirationGrid");




const PEXELS_API_KEY = "Qwl0nGc0mPbfzYVbGBmSFAKC5a1bJg1x7vCjMj6bRz26d3IcaHeLDz3N";

async function loadInspiration() {
  if (!inspirationBtn || !inspirationLoading || !inspirationError || !inspirationGrid || !inspirationEmpty) {
    return;
  }

  inspirationGrid.innerHTML = "";
  inspirationError.textContent = "";
  inspirationError.classList.add("hidden");
  inspirationEmpty.classList.add("hidden");

  inspirationLoading.classList.remove("hidden");

  try {
    const response = await fetch(
      "https://api.pexels.com/v1/search?query=web%20design&per_page=4",
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load inspiration images. Please check the API key and try again.");
    }

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      inspirationEmpty.classList.remove("hidden");
      return;
    }

    inspirationGrid.innerHTML = data.photos
      .map((photo) => {
        return `
          <div class="inspiration-card fade-in">
            <img class="inspiration-image" src="${photo.src.large}" alt="${photo.alt || "Design inspiration image"}">
            <h3>${photo.alt || "Design Inspiration"}</h3>

            <p class="inspiration-meta">Photographer: ${photo.photographer}</p>

            <a href="${photo.url}" target="_blank" rel="noopener noreferrer">
              <button type="button">View Source</button>
            </a>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    inspirationError.textContent = error.message;
    inspirationError.classList.remove("hidden");
  } finally {
    inspirationLoading.classList.add("hidden");
  }
}

if (inspirationBtn) {
  inspirationBtn.addEventListener("click", loadInspiration);

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