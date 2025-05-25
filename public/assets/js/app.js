// modal
const modal = {
  el: document.querySelector(".modal-overlay"),
  activeModal: null,

  init() {
    this.setupTriggers();
    this.setupOutsideClick();
  },

  setupTriggers() {
    const triggers = document.querySelectorAll("[data-modal]");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalName = trigger.dataset.modal;
        if (modalName === "close") {
          this.close();
        } else {
          this.open(modalName);
        }
      });
    });
  },

  setupOutsideClick() {
    this.el.addEventListener("click", (event) => {
      if (event.target === this.el) {
        this.close();
      }
    });
  },

  open(name) {
    const targetModal = this.el.querySelector(`[data-template="${name}"]`);

    if (targetModal) {
      this.close(true); // Close any currently active modal
      this.activeModal = targetModal;

      this.el.style.display = "flex"; // Show the overlay
      requestAnimationFrame(() => {
        this.el.classList.add("show"); // Animate overlay
        this.activeModal.style.display = "flex"; // Show modal content

        // Add animation class to modal content
        requestAnimationFrame(() => {
          this.activeModal.classList.add("show");
        });
      });
    } else {
      console.error(`Modal with name "${name}" not found.`);
    }
  },

  close(onlyModal = false) {
    if (onlyModal) {
      if (this.activeModal) {
        this.activeModal.style.display = "none"; // Fully hide modal content
        this.activeModal.classList.remove("show"); // Hide modal content
      }
    } else {
      if (this.activeModal) {
        this.activeModal.classList.remove("show"); // Hide modal content
        const modalToHide = this.activeModal; // Preserve reference for timeout
        this.activeModal = null;

        setTimeout(() => {
          modalToHide.style.display = "none"; // Fully hide after animation
        }, 250); // Match the CSS animation duration
      }

      this.el.classList.remove("show"); // Animate overlay
      this.el.addEventListener(
        "transitionend",
        () => {
          if (!this.el.classList.contains("show")) {
            this.el.style.display = "none"; // Fully hide overlay
          }
        },
        { once: true }
      );
    }
  },
};
modal.init();

// header
const header = document.querySelector(".header");
if (header) {
  const menu = header.querySelector(".header__menu");
  const services = menu.querySelectorAll(".menu-item-has-children");

  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  services.forEach((service) => {
    const subMenu = service.querySelector(".sub-menu");

    service.addEventListener("mouseenter", () => {
      subMenu.style.display = "grid"; // Ensure the submenu is visible

      setTimeout(() => {
        subMenu.dataset.state = "active";
      }, 10);
    });

    service.addEventListener("mouseleave", () => {
      subMenu.dataset.state = "inactive";

      subMenu.addEventListener("transitionend", function handler(event) {
        if (subMenu.dataset.state != "active") {
          subMenu.style.display = "none"; // Hide after fade-out
          subMenu.removeEventListener("transitionend", handler);
        }
      });
    });
  });

  const tabsEl = header.querySelector(".mobile__menu-tabs");
  const tabs = tabsEl.querySelectorAll("[data-toggle]");
  const tabsBody = header.querySelector(".mobile__menu-content");
  const tabsContent = header.querySelector("#menu-content");
  const tabsContentClose = header.querySelector(".mobile__menu-close");
  const tabsContacts = tabsEl.querySelector(".mobile__menu-contacts");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const isActive = tab.classList.contains("active");
      tabs.forEach((tab) => tab.classList.remove("active"));
      tabsContacts.style.maxHeight = 0;

      if (isActive) {
        tabsBody.classList.remove("show");

        // Wait for the animation to finish before setting display to 'none'
        tabsBody.addEventListener("transitionend", function handler(event) {
          if (
            event.propertyName === "transform" &&
            !tabsBody.classList.contains("show")
          ) {
            tabsBody.style.display = "none";
            tabsContent.innerHTML = "";
            tabsBody.removeEventListener("transitionend", handler);
          }
        });
      }

      // If tab was not already active, show the content
      if (!isActive) {
        tab.classList.add("active");

        if (tab.dataset.toggle != "contacts") {
          tabsBody.style.display = "flex";

          requestAnimationFrame(() => {
            tabsBody.classList.add("show");
          });
        } else {
          tabsContacts.style.maxHeight = tabsContacts.scrollHeight + "px";
          tabsBody.classList.remove("show");

          // Wait for the animation to finish before setting display to 'none'
          tabsBody.addEventListener("transitionend", function handler(event) {
            if (
              event.propertyName === "transform" &&
              !tabsBody.classList.contains("show")
            ) {
              tabsBody.style.display = "none";
              tabsContent.innerHTML = "";
              tabsBody.removeEventListener("transitionend", handler);
            }
          });
        }

        if (tab.dataset.toggle == "menu") {
          let html = menu.querySelector(".menu");
          tabsContent.innerHTML = html.outerHTML;
        } else if (tab.dataset.toggle == "catalog") {
          let menuServices = menu.querySelector(
            ".menu-item-has-children .sub-menu"
          );

          tabsContent.innerHTML = menuServices.outerHTML;
        }
      }
    });
  });

  tabsContentClose.addEventListener("click", () => {
    // Add animation for hiding
    tabsBody.classList.remove("show");
    tabsBody.addEventListener("transitionend", function handler(event) {
      if (
        event.propertyName === "transform" &&
        !tabsBody.classList.contains("show")
      ) {
        tabsBody.style.display = "none";
        tabsContent.innerHTML = "";
        tabsBody.removeEventListener("transitionend", handler);
      }
    });

    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
  });
}

// stages
const stages = document.querySelector(".stages");
if (stages) {
  const tabs = stages.querySelectorAll(".stages__list-item");
  const items = stages.querySelectorAll(".stages__content-item");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      items.forEach((i) => i.classList.remove("active"));

      tab.classList.add("active");
      items[index].classList.add("active");
      window.scrollTo({
        top: stages.offsetTop - 100, // Adjust the offset as needed
        behavior: "smooth",
      });
    });
  });
}

// Accordions
const getAccordionParents = document.querySelectorAll("[data-accordion");
getAccordionParents.forEach((parent) => {
  const isMultiple = parent.dataset.multiple;
  const accordions = parent.querySelectorAll(".accordion");
  accordions.forEach((accordion, index, arr) => {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");
    const content = accordion.querySelector(".accordion__content");

    header.addEventListener("click", () => {
      const isActive = accordion.classList.contains("active");

      if (!isActive) {
        accordion.classList.add("active");
        header.dataset.state = "opened";
        body.style.maxHeight = content.scrollHeight + "px";
      } else {
        accordion.classList.remove("active");
        header.dataset.state = "closed";
        body.style.maxHeight = 0;
      }

      if (!isMultiple || isMultiple == "false") {
        arr.forEach((el) => {
          const header = el.querySelector(".accordion__header");

          if (el !== accordion) {
            el.classList.remove("active");
            header.dataset.state = "closed";
            el.querySelector(".accordion__body").style.maxHeight = 0;
          }
        });
      }
    });
  });
});

// Footer
const currentYear = document.getElementById("current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Swipers
let directionsSwiper = new Swiper(".directions .directions__list", {
  slidesPerView: "auto",
  spaceBetween: 12,
  breakpoints: {
    475: {
      spaceBetween: 15,
    },
    640: {
      spaceBetween: 20,
    },
    1280: {
      spaceBetween: 30,
    },
    1680: {
      slidesPerView: 5,
      spaceBetween: 40,
    },
  },
});

let specialistsSwiper = new Swiper(".specialists .specialists__list .swiper", {
  slidesPerView: "auto",
  spaceBetween: 12,
  navigation: {
    nextEl: ".specialists .specialists__list .swiper-button-next",
    prevEl: ".specialists .specialists__list .swiper-button-prev",
  },
  breakpoints: {
    475: {
      spaceBetween: 15,
    },
    640: {
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1680: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

let gallerySwiper = new Swiper(".gallery .gallery__list .swiper", {
  slidesPerView: "auto",
  spaceBetween: 12,
  // allowTouchMove: false,
  navigation: {
    nextEl: ".gallery .gallery__list .swiper-button-next",
    prevEl: ".gallery .gallery__list .swiper-button-prev",
  },
  breakpoints: {
    475: {
      spaceBetween: 20,
    },
  },
});

let licenseSwiper = new Swiper(".license .license__swiper", {
  slidesPerView: "auto",
  spaceBetween: 15,
  breakpoints: {
    475: {
      spaceBetween: 20,
    },
  },
});

let reviewsSwiper = new Swiper(".reviews .reviews__list .swiper", {
  slidesPerView: "auto",
  spaceBetween: 12,
  navigation: {
    nextEl: ".reviews .reviews__list .swiper-button-next",
    prevEl: ".reviews .reviews__list .swiper-button-prev",
  },
  pagination: {
    el: ".reviews .reviews__list .swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    475: {
      spaceBetween: 15,
    },
    640: {
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

// Initialize the fancybox
const fancyboxTriggers = Array.from(
  document.querySelectorAll("[data-fancybox]")
).filter((trigger) => trigger.dataset.fancybox);
if (fancyboxTriggers) {
  const fancyboxInstances = [];
  fancyboxTriggers.forEach((trigger) => {
    const name = trigger.dataset.fancybox;
    if (fancyboxInstances.includes(name)) {
      return; // Skip if already bound
    }
    // Add the name to the `fancyboxInstances` list
    fancyboxInstances.push(name);
  });
  fancyboxInstances.forEach((name) => {
    Fancybox.bind(`[data-fancybox="${name}"]`, {
      Images: { Panzoom: { maxScale: 3 } },
    });
  });
}

// init phone mask
const phoneMasks = document.querySelectorAll("input[name='phone']");
phoneMasks.forEach((input) => {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      newValue = newValue.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue;
    if (event.type == "blur" && this.value.length < 5) this.value = "";

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = "true";
    } else {
      input.dataset.numbervalid = "false";
    }
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

// form
function successSend() {
  modal.open("success");

  setTimeout(() => {
    modal.close();
  }, 3000);
}

const forms = document.querySelectorAll(".the-form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successSend();
  });
});
