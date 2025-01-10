// Function to prefetch a page
function prefetchPage(url) {
  if (url) {
    fetch(url, { rel: "prefetch" });
  }
}

// Prefetch previous and next pages on load
prefetchPage(document.getElementById("prevLink")?.href);
prefetchPage(document.getElementById("nextLink")?.href);

// Function to categorize image based on aspect ratio
function categorizeImage(img) {
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const imgFrame = document.getElementById("photo-image");

  imgFrame.classList.remove(
    "image-landscape",
    "image-portrait",
    "image-square",
  );

  if (aspectRatio > 1.2) {
    imgFrame.classList.add("image-landscape");
  } else if (aspectRatio < 0.8) {
    imgFrame.classList.add("image-portrait");
  } else {
    imgFrame.classList.add("image-square");
  }
}

function adjustImageSize() {
  const imgFrame = document.getElementById("photo-image");
  const img = imgFrame.querySelector("img");
  const photoContent = document.getElementById("photo-content");
  const globalNav = document.querySelector(
    "main.wrapper > nav.navigation:first-of-type",
  );
  const pageNav = document.getElementById("page-navigation"); // Get the page navigation element

  if (img.complete) {
    categorizeImage(img); // Categorize the image based on aspect ratio

    // 1. Calculate Available Height (when not active):
    const windowHeight = window.innerHeight;
    const chromeHeight = pageNav.offsetHeight + globalNav.offsetHeight;
    const availableHeight = windowHeight - chromeHeight; // Subtract page navigation height

    // 2. Set Image Container Height (Dynamically):
    imgFrame.style.height = `${availableHeight}px`;

    // 3. Calculate and Set TranslateY for Active State:
    //    - Get the computed style for the element
    const computedStyle = window.getComputedStyle(photoContent);

    //   - Extract the value, removing 'px' and converting to a number
    const photoContentHeight = parseFloat(
      computedStyle.getPropertyValue("height").replace("px", ""),
    );
    const translateYValue = photoContentHeight / 2;

    imgFrame.style.setProperty("--translate-y-active", `-${translateYValue}px`);

    // Fade in the title after the image is resized
    const title = document.querySelector("h1.photo-title");
    title.classList.add("fade-in");
  } else {
    img.onload = function () {
      adjustImageSize();
    };
  }
}

// Add transition effect
function updateTransition() {
  const article = document.getElementById("photo-image");
  article.style.visibility = "hidden";
  article.classList.remove("fade-in");
  setTimeout(() => {
    article.classList.add("fade-in");
    article.style.visibility = "visible";
  }, 200);
}

// Make the function globally accessible (for debugging)
window.updateTransition = updateTransition;

// Function to handle navigation (triggered by click or key press)
function navigateToPage(url) {
  if (!url) {
    return; // Don't navigate if the URL is null
  }

  const article = document.getElementById("photo-image");
  article.style.visibility = "hidden";

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract the new imgFrame content, INCLUDING the image and metadata
      const newImgFrame = doc.getElementById("photo-image").innerHTML;
      // Extract new metadata content
      const newMetadata = doc.getElementById("photo-content").innerHTML;

      // Update the imgFrame with the new content
      article.innerHTML = newImgFrame;

      // Update metadata
      document.getElementById("photo-content").innerHTML = newMetadata;

      article.style.visibility = "visible";

      // Update the URL after the content is loaded
      history.pushState(null, "", url);

      // --- Update navigation without replacing the element ---
      const newPageNavigation = doc.getElementById("page-navigation");
      const existingPageNavigation = document.getElementById("page-navigation");

      // Replace only the children, not the page-navigation element itself
      existingPageNavigation.innerHTML = newPageNavigation.innerHTML;

      // --- End of navigation update ---

      // Get the new image element
      const img = article.querySelector("img");

      // Re-initialize setup functions
      setupToggleEventListener();
      setupSwipeGestures();
      setupClickableItems();

      // Wait for the new image to load before adjusting size
      img.onload = function () {
        adjustImageSize();
        updateTransition();
      };

      // Adjust image size immediately if image is already loaded (cached)
      if (img.complete) {
        adjustImageSize();
        updateTransition();
      }

      prefetchPage(getNextPageUrl());
      prefetchPage(getPreviousPageUrl());
    })
    .catch((error) => console.error("Error fetching content:", error));
}

// Function to set up clickable items
function setupClickableItems() {
  const photoItems = document.querySelectorAll(".photo-item");

  photoItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      // Check if the click is on the photo-item or its child
      if (event.target.closest(".photo-item") !== item) {
        return; // Ignore clicks on other elements
      }

      const link = item.querySelector("a");
      if (link) {
        // Check if Ctrl key or Meta key is pressed
        if (event.ctrlKey || event.metaKey) {
          // Open link in a new tab or window
          window.open(link.href, "_blank");
        } else {
          // Navigate to the link in the same tab or window
          window.location.href = link.href;
        }
      }
    });
  });
}

// Apply fade-in class, adjust image size, and categorize image on initial page load
window.addEventListener("load", () => {
  const imgFrame = document.getElementById("photo-image");
  const img = imgFrame.querySelector("img");

  if (img.complete) {
    adjustImageSize();
    categorizeImage(img); // Categorize the image on load
  } else {
    img.onload = function () {
      adjustImageSize();
      categorizeImage(img); // Categorize the image once loaded
    };
  }

  updateTransition();
  setupToggleEventListener();
  setupClickableItems(); // set up clickable items
});

// Handle window resize
window.addEventListener("resize", () => {
  const imgFrame = document.getElementById("photo-image");
  const img = imgFrame.querySelector("img");
  adjustImageSize();
  categorizeImage(img); // Re-categorize the image on resize
});

// Handle keydown events
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    const prevLink = document.getElementById("prevLink");
    if (prevLink && !prevLink.classList.contains("disabled")) {
      navigateToPage(getPreviousPageUrl());
    }
  } else if (event.key === "ArrowRight") {
    const nextLink = document.getElementById("nextLink");
    if (nextLink && !nextLink.classList.contains("disabled")) {
      navigateToPage(getNextPageUrl());
    }
  }
});

document.getElementById("prevLink")?.addEventListener("click", (event) => {
  const prevPageUrl = getPreviousPageUrl();
  if (prevPageUrl) {
    console.log("Previous page URL found:", prevPageUrl);
    navigateToPage(prevPageUrl);
  }
});

document.getElementById("nextLink")?.addEventListener("click", (event) => {
  const nextPageUrl = getNextPageUrl();
  if (nextPageUrl) {
    console.log("Next page URL found:", nextPageUrl);
    navigateToPage(nextPageUrl);
  }
});

function getPreviousPageUrl() {
  const prevLink = document.getElementById("prevLink");
  // Check if the href is not empty
  return prevLink && prevLink.href !== "" ? prevLink.href : null;
}

function getNextPageUrl() {
  const nextLink = document.getElementById("nextLink");
  // Check if the href is not empty
  return nextLink && nextLink.href !== "" ? nextLink.href : null;
}

// Function to set up the toggle event listener
function setupToggleEventListener() {
  document.addEventListener("click", function (event) {
    if (event.target.closest("#toggleMetadata")) {
      console.log("toggle");
      const metadataSection = document.getElementById("photo-container");
      const photoImage = document.getElementById("photo-image");

      metadataSection.classList.toggle("is-active");

      // Remove the inline style to allow CSS to handle the transition
      if (metadataSection.classList.contains("is-active")) {
        photoImage.style.transform = ""; // Remove inline style
      } else {
        photoImage.style.transform = ""; // Remove inline style
      }

      // Adjust image size after toggling
      adjustImageSize();
    }
  });
}
