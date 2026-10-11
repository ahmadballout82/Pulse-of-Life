
"use strict";

/* =========================================
   نبض الحياة | Medical Center
   Complete JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     Elements
  ========================================= */

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const yearElement = document.getElementById("year");

  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentFeedback = document.getElementById("appointmentFeedback");

  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  /* =========================================
     Current Year
  ========================================= */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* =========================================
     Mobile Navigation
  ========================================= */

  function closeMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");
  }

  function openMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "إغلاق القائمة");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 950) {
        closeMenu();
      }
    });
  }

  /* =========================================
     Smooth Navigation
  ========================================= */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.getElementById(href.substring(1));

      if (!target) return;

      event.preventDefault();

      closeMenu();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (window.location.hash !== href) {
        history.pushState(null, "", href);
      }

      updateActiveNavigation(href.substring(1));
    });
  });

  /* =========================================
     Active Navigation
  ========================================= */

  function updateActiveNavigation(sectionId) {
    navLinks.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const sectionIds = [
    "home",
    "about",
    "specialties",
    "services",
    "doctors",
    "contact"
  ];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function detectActiveSection() {
    const scrollPosition = window.scrollY + 180;

    let activeSection = "home";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        activeSection = section.id;
      }
    });

    updateActiveNavigation(activeSection);
  }

  /* =========================================
     Header and Back To Top
  ========================================= */

  function handleScroll() {
    if (header) {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 30
      );
    }

    if (backToTop) {
      backToTop.classList.toggle(
        "visible",
        window.scrollY > 450
      );
    }

    detectActiveSection();
  }

  let scrollScheduled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      requestAnimationFrame(() => {
        handleScroll();
        scrollScheduled = false;
      });
    },
    { passive: true }
  );

  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });

      closeMenu();
    });
  }

  /* =========================================
     Date Helpers
  ========================================= */

  function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getToday() {
    return formatLocalDate(new Date());
  }

  const appointmentDate = document.getElementById("appointmentDate");

  function updateMinimumAppointmentDate() {
    if (!appointmentDate) return;

    const today = getToday();

    appointmentDate.min = today;

    if (appointmentDate.value && appointmentDate.value < today) {
      appointmentDate.value = "";
    }
  }

  updateMinimumAppointmentDate();

  appointmentDate?.addEventListener("focus", () => {
    updateMinimumAppointmentDate();
  });

  /* =========================================
     Form Feedback
  ========================================= */

  function showFeedback(element, message, type = "success") {
    if (!element) return;

    element.textContent = message;

    element.classList.remove("success", "error");
    element.classList.add(type);

    element.setAttribute("role", "status");
  }

  function clearFeedback(element) {
    if (!element) return;

    element.textContent = "";
    element.classList.remove("success", "error");
  }

  /* =========================================
     Appointment Form
  ========================================= */

  const specialtyNames = {
    general: "الطب العام",
    cardiology: "أمراض القلب",
    dental: "طب الأسنان",
    pediatrics: "طب الأطفال",
    dermatology: "الجلدية",
    orthopedics: "العظام والمفاصل"
  };

  function formatArabicDate(dateValue) {
    const parts = dateValue.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return dateValue;
    }

    const [year, month, day] = parts;

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  if (appointmentForm) {

    appointmentForm.addEventListener("input", () => {
      clearFeedback(appointmentFeedback);
    });

    appointmentForm.addEventListener("change", () => {
      clearFeedback(appointmentFeedback);
    });

    appointmentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      updateMinimumAppointmentDate();

      const name = document
        .getElementById("patientName")
        ?.value.trim();

      const phone = document
        .getElementById("patientPhone")
        ?.value.trim();

      const specialty = document
        .getElementById("specialty")
        ?.value;

      const date = document
        .getElementById("appointmentDate")
        ?.value;

      const time = document
        .getElementById("appointmentTime")
        ?.value;

      if (!name || !phone || !specialty || !date || !time) {
        showFeedback(
          appointmentFeedback,
          "يرجى تعبئة جميع الحقول المطلوبة",
          "error"
        );
        return;
      }

      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        showFeedback(
          appointmentFeedback,
          "يرجى إدخال رقم هاتف صحيح",
          "error"
        );
        return;
      }

      if (date < getToday()) {
        showFeedback(
          appointmentFeedback,
          "يرجى اختيار تاريخ اليوم أو تاريخ قادم",
          "error"
        );
        return;
      }

      const selectedDate = new Date(`${date}T00:00:00`);

      if (Number.isNaN(selectedDate.getTime())) {
        showFeedback(
          appointmentFeedback,
          "يرجى اختيار تاريخ صحيح",
          "error"
        );
        return;
      }

      const selectedSpecialty =
        specialtyNames[specialty] || "التخصص المختار";

      const selectedTime =
        document.getElementById("appointmentTime")
          ?.selectedOptions[0]?.textContent.trim() || time;

      const readableDate = formatArabicDate(date);

      showFeedback(
        appointmentFeedback,
        `تمت تجربة الحجز بنجاح يا ${name} في قسم ${selectedSpecialty} بتاريخ ${readableDate} الساعة ${selectedTime} — هذا تأكيد تجريبي فقط ولم يتم تسجيل موعد فعلي`,
        "success"
      );

      appointmentForm.reset();
      updateMinimumAppointmentDate();
    });
  }

  /* =========================================
     Contact Form
  ========================================= */

  if (contactForm) {

    contactForm.addEventListener("input", () => {
      clearFeedback(contactFeedback);
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document
        .getElementById("contactName")
        ?.value.trim();

      const email = document
        .getElementById("contactEmail")
        ?.value.trim();

      const message = document
        .getElementById("contactMessage")
        ?.value.trim();

      if (!name || !email || !message) {
        showFeedback(
          contactFeedback,
          "يرجى تعبئة جميع الحقول المطلوبة",
          "error"
        );
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showFeedback(
          contactFeedback,
          "يرجى إدخال بريد إلكتروني صحيح",
          "error"
        );
        return;
      }

      if (message.length < 5) {
        showFeedback(
          contactFeedback,
          "يرجى كتابة رسالة تحتوي على خمسة أحرف على الأقل",
          "error"
        );
        return;
      }

      showFeedback(
        contactFeedback,
        `شكرًا لك يا ${name} تمت تجربة إرسال الرسالة بنجاح — لم يتم إرسال أي بيانات فعلية`,
        "success"
      );

      contactForm.reset();
    });
  }

  /* =========================================
     Hash Navigation On Load
  ========================================= */

  if (window.location.hash) {
    const initialId = decodeURIComponent(
      window.location.hash.substring(1)
    );

    const initialSection = document.getElementById(initialId);

    if (initialSection) {
      updateActiveNavigation(initialId);
    }
  }

  window.addEventListener("hashchange", () => {
    const sectionId = decodeURIComponent(
      window.location.hash.substring(1)
    );

    if (sectionId) {
      updateActiveNavigation(sectionId);
    } else {
      updateActiveNavigation("home");
    }
  });

});
