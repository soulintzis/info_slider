document.addEventListener("DOMContentLoaded", function () {
  const imageContainers = document.querySelectorAll(".image-container");
  const sliderContainer = document.querySelector(".slider-container");
  const closeButton = document.querySelector(".controls__close");
  let swiper = null;
  let currentSlideIndex = 0;
  let isModalOpen = false;

  function initSwiper() {
    swiper = new Swiper(".swiper-container", {
      preloadImages: false,
      loop: false,
      allowTouchMove: true,
      resizeObserver: true,
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      keyboard: { enabled: true },
      speed: 950,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  function openSlider(startIndex) {
    initSwiper();
    setupSlides();
    showSlider();
    setupButtons();
    
    function setupSlides() {
      swiper.removeAllSlides();
      imageContainers.forEach((container, index) => {
        const img = container.querySelector("img").cloneNode(true);
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.setAttribute("key", index);
        slide.appendChild(img);
        swiper.appendSlide(slide);
      });
      swiper.slideToLoop(startIndex, 0);
    }
    
    function showSlider() {
      sliderContainer.style.display = "block";
      sliderContainer.classList.add("show");
    }

    function setupButtons() {
      const slides = swiper.slides;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
    
      slides.forEach((slide, index) => {
        const buttonsData = imageButtonData[index] || [];
        const img = slide.querySelector("img");
    
        img.onload = () => {
          const containerWidth = img.width;
          const containerHeight = img.height;
    
          buttonsData.forEach((buttonObj) => {
            const button = document.createElement("button");
            button.classList.add("artwork__info-button", "artwork-button"); // Add the class "artwork-button"
    
            button.setAttribute("data-id", buttonObj.id);
            button.setAttribute("data-title", buttonObj.title);
            button.setAttribute("data-artist", buttonObj.artist);
            button.setAttribute("data-year", buttonObj.year);
            button.setAttribute(
              "data-image-url",
              generateImageUrl(buttonObj.artist, buttonObj.id)
            );
            button.setAttribute(
              "data-url",
              generateUrl(buttonObj.artist, buttonObj.id)
            );
            button.addEventListener("click", handleButtonClick);
    
            const icon = document.createElement("img");
            icon.setAttribute("src", "icon.svg");
            icon.classList.add("artwork__info-icon");
    
            button.appendChild(icon);
    
            const marginLeft = (viewportWidth - containerWidth) / 2;
            const marginTop = (viewportHeight - containerHeight) / 2;
    
            const left = (buttonObj.left / 100) * containerWidth;
            const top = (buttonObj.top / 100) * containerHeight;
    
            button.style.position = "absolute";
            button.style.left = `${marginLeft + left}px`;
            button.style.top = `${marginTop + top}px`;
    
            slide.appendChild(button);
          });
        };
      });
    }
  }

  const toggleButton = document.querySelector(".swiper-toggle-info-button");
  toggleButton.addEventListener("click", toggleButtons);
  
  let isButtonsHidden = false;
  
  function toggleButtons() {
    const artworkButtons = document.querySelectorAll(".artwork-button");
    artworkButtons.forEach((button) => {
      button.classList.toggle("hidden");
    });
  
    // Get the span element by ID
    const toggleText = document.getElementById("swiperToggleButtonText");
  
    if (isButtonsHidden) {
      toggleText.textContent = "HIDE";
    } else {
      toggleText.textContent = "SHOW";
    }
  
    isButtonsHidden = !isButtonsHidden;
  }

  function generateImageUrl(artist, id) {
    const artistSlug = artist.toLowerCase().replace(/\s+/g, "-");
    return `https://www.hellenicdiaspora.org/wp-content/uploads/media/${artistSlug}/${artistSlug}-${id}.jpg`;
  }

  function generateUrl(artist, id) {
    const artistSlug = artist.toLowerCase().replace(/\s+/g, "-");
    return `https://www.hellenicdiaspora.org/home/portfolio-item/${artistSlug}-${id}/`;
  }

  const modalOverlay = document.querySelector(".artwork__modal-overlay");
  const modalImage = document.querySelector(".artwork__modal-image");
  const modalTitle = document.querySelector(".artwork__modal-title");
  const modalArtist = document.querySelector(".artwork__modal-artist");
  const modalYear = document.querySelector(".artwork__modal-year");
  const modalUrl = document.querySelector(".artwork__modal-url");
  const modalClose = document.querySelector(".artwork__modal-close");

  function handleButtonClick(event) {
    if (!isModalOpen) {
      const button = event.target.closest("button");
  
      if (button) {
        const imageData = getImageDataFromButton(button);
        displayModal(imageData);
      }
    }
  }

  function getImageDataFromButton(button) {
    return {
      image: button.getAttribute("data-image-url"),
      title: button.getAttribute("data-title"),
      artist: button.getAttribute("data-artist"),
      year: button.getAttribute("data-year"),
      url: button.getAttribute("data-url"),
    };
  }

  const spinnerContainer = document.querySelector(".spinner-container");
  
  function displayModal(imageData) {
    isModalOpen = true;
    spinnerContainer.style.display = "flex";
    
    modalImage.onload = () => {
      modalTitle.textContent = imageData.title;
      modalArtist.textContent = imageData.artist;
      modalYear.textContent = imageData.year;
      modalUrl.href = imageData.url;
      modalOverlay.style.display = "block";
      spinnerContainer.style.display = "none";
    };
    
    modalImage.src = imageData.image;
  }

  modalClose.addEventListener("click", () => {
    closeModal();
  });

  function closeModal() {
    isModalOpen = false;
    modalOverlay.style.display = "none";
    modalImage.src = "";
    modalTitle.textContent = "";
    modalArtist.textContent = "";
    modalYear.textContent = "";
    modalUrl.href = "#";
    spinnerContainer.style.display = "none";
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function () {
      swiper.destroy();
      swiper = null;
      openSlider(currentSlideIndex);
    }, 20);
  });

  imageContainers.forEach((container, index) => {
    container.addEventListener("click", () => {
      openSlider(index);
    });
  });

  closeButton.addEventListener("click", () => {
    if (swiper) {
      swiper.destroy();
      swiper = null;
    }
    sliderContainer.style.display = "none";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && swiper && !isModalOpen) {
      swiper.destroy();
      swiper = null;
      sliderContainer.style.display = "none";
    } else if (event.key === "Escape" && isModalOpen) {
      closeModal();
    } else if (event.key == "ArrowLeft" && isModalOpen) {
      closeModal();
    } else if (event.key == "ArrowRight" && isModalOpen) {
      closeModal();
    }
  });
});
