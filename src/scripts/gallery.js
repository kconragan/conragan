/**
 * @file Manages client-side interactions for image gallery, including
 * dynamic resizing, image categorization, transition effects,
 * metadata toggling, keyboard navigation, and prefetching.
 */

/**
 * Prefetches a page to improve navigation speed.
 * @param {string} url - The URL to prefetch.
 */
function prefetchPage(url) {
  if (url) {
    fetch(url, { rel: "prefetch" });
  }
}

/**
 * Immediately prefetches the previous and next pages on page load to make
 * navigation smoother.
 */
(function prefetchAdjacentPages() {
  prefetchPage(document.getElementById("prevLink")?.href);
  prefetchPage(document.getElementById("nextLink")?.href);
})();

/**
 * Dynamically adjusts the image size to fit within the viewport,
 * considering header, footer, and border sizes.
 *
 * Also responsible for fading in the title after resizing and categorizing the image.
 */
function adjustImageSize() {
  const imgFrame = document.getElementById("photo-image");
  const img = imgFrame?.querySelector("img");
  if (!imgFrame || !img) return; // Exit early if not found

  const photoContent = document.getElementById("photo-content");
  const globalNav = document.querySelector("div.wrapper > header:first-of-type");
  const pageNav = document.getElementById("page-navigation");

  if (img.complete) {
    categorizeImage(img);

    // 1. Calculate Available Height
    const windowHeight = window.innerHeight;
    const computedImgStyle = window.getComputedStyle(img);
    const borderWidth = parseFloat(computedImgStyle.borderTopWidth);
    const imageBuffer = 16;

    const chromeHeight =
      pageNav.offsetHeight +
      globalNav.offsetHeight +
      borderWidth * 2 +
      imageBuffer;

    const availableHeight = windowHeight - chromeHeight;

    // 2. Set Image Container Height
    imgFrame.style.height = `${availableHeight}px`;

    // 3. Calculate and Set TranslateY for Active State:
    const photoContentHeight = parseFloat(
      window
        .getComputedStyle(photoContent)
        .getPropertyValue("height")
        .replace("px", ""),
    );
    const translateYValue = photoContentHeight / 2;

    imgFrame.style.setProperty("--translate-y-active", `-${translateYValue}px`);

    // Fade in the title after resizing
    const title = document.querySelector("h1.photo-title");
    title?.classList.add("fade-in");
  } else {
    img.onload = () => {
      adjustImageSize();
    };
  }
}

/**
 * Categorizes an image based on its aspect ratio by applying a corresponding
 * class to the image frame (image-landscape, image-portrait, or image-square).
 * @param {HTMLImageElement} img - The image element to categorize.
 */
function categorizeImage(img) {
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const imgFrame = document.getElementById("photo-image");

  imgFrame?.classList.remove(
    "image-landscape",
    "image-portrait",
    "image-square",
  );

  if (aspectRatio > 1.2) {
    imgFrame?.classList.add("image-landscape");
  } else if (aspectRatio < 0.8) {
    imgFrame?.classList.add("image-portrait");
  } else {
    imgFrame?.classList.add("image-square");
  }
}

/**
 * Manages the transition effect when loading a new image, creating a fade-in
 * effect to improve user experience.
 */
function updateTransition() {
  const article = document.getElementById("photo-image");
  article?.style.setProperty("visibility", "hidden");
  article?.classList.remove("fade-in");

  // Use requestAnimationFrame for smoother transition
  requestAnimationFrame(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        article?.classList.add("fade-in");
        article?.style.setProperty("visibility", "visible");
      });
    }, 200);
  });
}

/**
 * Sets up an event listener to toggle the visibility of the metadata section
 * and adjust the image position accordingly.
 */
function setupToggleEventListener() {
  const toggleButton = document.getElementById("toggleMetadata"); // More Specific
  if (!toggleButton) return;

  const clickHandler = () => { // Define as Named Function
    const metadataSection = document.getElementById("photo-container");
    const photoImage = document.getElementById("photo-image");

    metadataSection?.classList.toggle("is-active");
    photoImage?.style.removeProperty("transform"); // Remove inline style, let CSS handle it
    adjustImageSize(); // Adjust image size after toggling
  };

  toggleButton.addEventListener("click", clickHandler);

  // Return a cleanup function
  return () => {
    toggleButton.removeEventListener("click", clickHandler);
  };
}

/**
 * Sets up event listeners for clickable photo items within the gallery,
 * enabling navigation on click while supporting opening in a new tab using
 * Ctrl/Cmd key.
 */
function setupClickableItems() {
  const photoItems = document.querySelectorAll(".photo-item");

  photoItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const link = item.querySelector("a");
      if (!link) return;

      if (event.ctrlKey || event.metaKey) {
        window.open(link.href, "_blank");
      } else {
        window.location.href = link.href;
      }
    });
  });
}

/**
 * Navigates to the parent category of the current image.
 */
function navigateToParentSection() {
  const currentUrl = window.location.pathname;
  const parts = currentUrl.split("/");
  // Assuming URL structure: /photography/genre/image-name/
  if (parts.length > 3) {
    const parentSectionUrl = parts.slice(0, -2).join("/") + "/";
    window.location.href = parentSectionUrl;
  }
}

/**
 * Fetches the content of a new page and updates the current page's content
 * dynamically.
 * @param {string} url - The URL of the page to navigate to.
 */
function navigateToPage(url) {
  if (!url) return;

  const article = document.getElementById("photo-image");
  article?.style.setProperty("visibility", "hidden");

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Assume we're on a single image page
      article.innerHTML = doc.getElementById("photo-image").innerHTML;
      document.getElementById("photo-content").innerHTML =
        doc.getElementById("photo-content").innerHTML;

      article.style.setProperty("visibility", "visible");
      history.pushState(null, "", url);

      // Update navigation without replacing the element
      const newPageNavigation = doc.getElementById("page-navigation");
      const existingPageNavigation = document.getElementById("page-navigation");
      if(newPageNavigation && existingPageNavigation) {
           existingPageNavigation.innerHTML = newPageNavigation.innerHTML;
      }


      // Re-initialize setup functions
      const toggleCleanup = setupToggleEventListener(); // capture result
      setupClickableItems();

      const img = article.querySelector("img");

      img.onload = () => {
        adjustImageSize();
        updateTransition();
      };

      if (img.complete) {
        adjustImageSize();
        updateTransition();
      }

      // Prefetch new adjacent pages
      prefetchPage(getNextPageUrl());
      prefetchPage(getPreviousPageUrl());
    })
    .catch((error) => console.error("Error fetching content:", error));
}

/**
 * Adds click event listeners to the previous and next page links.
 */
(function setupPageNavigation() {
  document.getElementById("prevLink")?.addEventListener("click", (event) => {
    const prevPageUrl = getPreviousPageUrl();
    if (prevPageUrl) {
      navigateToPage(prevPageUrl);
    }
    event.preventDefault(); // Prevent default link behavior
  });

  document.getElementById("nextLink")?.addEventListener("click", (event) => {
    const nextPageUrl = getNextPageUrl();
    if (nextPageUrl) {
      navigateToPage(nextPageUrl);
    }
      event.preventDefault(); // Prevent default link behavior
  });
})();

/**
 * Gets the URL of the previous page from the prevLink element.
 * @returns {string|null} - The URL of the previous page, or null if not found.
 */
function getPreviousPageUrl() {
  const prevLink = document.getElementById("prevLink");
  return prevLink?.href || null;
}

/**
 * Gets the URL of the next page from the nextLink element.
 * @returns {string|null} - The URL of the next page, or null if not found.
 */
function getNextPageUrl() {
  const nextLink = document.getElementById("nextLink");
  return nextLink?.href || null;
}

let toggleCleanup

/**
 * Initializes the page by adjusting image size, categorizing the image, setting up
 * event listeners, and applying transition effects.
 */
window.addEventListener("load", () => {

  if(toggleCleanup && typeof toggleCleanup === 'function'){
     toggleCleanup()
  }

  const imgFrame = document.getElementById("photo-image");
  if (!imgFrame) return;

  const img = imgFrame.querySelector("img");

  const initializeImage = () => {
    adjustImageSize();
    categorizeImage(img);
  };

  if (img.complete) {
    initializeImage();
  } else {
    img.onload = initializeImage;
  }

  updateTransition();
  toggleCleanup = setupToggleEventListener();
  setupClickableItems();
});

/**
 * Handles window resize events by adjusting image size and re-categorizing the
 * image to maintain proper display.
 */
window.addEventListener("resize", () => {
  const imgFrame = document.getElementById("photo-image");
  if (!imgFrame) return;

  const img = imgFrame.querySelector("img");
  adjustImageSize();
  categorizeImage(img);
});

/**
 * Handles keyboard navigation using arrow keys for next and previous pages, and
 * Escape key for navigating to the parent section.
 */
document.addEventListener("keydown", (event) => {
  let targetPageUrl = null;
  if (event.key === "ArrowLeft") {
    targetPageUrl = getPreviousPageUrl();
  } else if (event.key === "ArrowRight") {
    targetPageUrl = getNextPageUrl();
  } else if (event.key === "Escape") {
    navigateToParentSection();
    return; // prevent double-handling
  }

  if (targetPageUrl) {
    navigateToPage(targetPageUrl);
  }
});
