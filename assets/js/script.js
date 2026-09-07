(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };

  function createImageLightbox() {
    let modal = document.querySelector(".img-lightbox");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "img-lightbox";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `<button class="img-lightbox-close" type="button" aria-label="Close image">×</button><img alt=""><div class="img-lightbox-caption"></div>`;
    document.body.appendChild(modal);
    const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open"); };
    modal.querySelector(".img-lightbox-close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    return modal;
  }

  function openImage(img) {
    const modal = createImageLightbox();
    const modalImg = modal.querySelector("img");
    const caption = modal.querySelector(".img-lightbox-caption");
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || "";
    const figure = img.closest("figure");
    const card = img.closest(".card, .service-card");
    caption.textContent = figure?.querySelector("figcaption")?.textContent?.trim() || card?.querySelector("h3")?.textContent?.trim() || img.alt || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function wireStandardBA(box) {
    const range = box.querySelector(".range");
    const after = box.querySelector(".after");
    const line = box.querySelector(".line");
    const handle = box.querySelector(".handle");
    if (!range || !after) return;
    const update = () => {
      const value = Number(range.value || 50);
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      if (line) line.style.left = `${value}%`;
      if (handle) handle.style.left = `${value}%`;
    };
    range.addEventListener("input", update);
    range.addEventListener("change", update);
    update();
  }

  function wireInteractiveCompare(box) {
    const range = box.querySelector(".compare-range");
    const overlay = box.querySelector(".after-wrap");
    const handle = box.querySelector(".compare-handle");
    if (!range || !overlay) return;
    const update = () => {
      const value = Number(range.value || 50);
      overlay.style.width = `${value}%`;
      if (handle) handle.style.left = `${value}%`;
    };
    range.addEventListener("input", update);
    range.addEventListener("change", update);
    update();
  }

  function createBAModal() {
    let modal = document.querySelector(".ba-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "ba-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `<div class="ba-modal-content"><button class="img-lightbox-close" type="button" aria-label="Close before after viewer">×</button><h3 class="ba-modal-title">Before / After Preview</h3><div class="ba-modal-holder"></div><div class="ba-modal-note">Drag the slider to compare Before and After.</div></div>`;
    document.body.appendChild(modal);
    const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open"); };
    modal.querySelector(".img-lightbox-close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    return modal;
  }

  function openStandardBA(box, title) {
    const modal = createBAModal();
    const holder = modal.querySelector(".ba-modal-holder");
    holder.innerHTML = "";
    const clone = box.cloneNode(true);
    clone.querySelectorAll(".ba-open").forEach((btn) => btn.remove());
    holder.appendChild(clone);
    wireStandardBA(clone);
    modal.querySelector(".ba-modal-title").textContent = title || "Before / After Preview";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function openInteractiveCompare(box, title) {
    const modal = createBAModal();
    const holder = modal.querySelector(".ba-modal-holder");
    holder.innerHTML = "";
    const clone = box.cloneNode(true);
    clone.querySelectorAll(".compare-open").forEach((btn) => btn.remove());
    holder.appendChild(clone);
    wireInteractiveCompare(clone);
    modal.querySelector(".ba-modal-title").textContent = title || "Decluttering Before / After";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function initBeforeAfter() {
    document.querySelectorAll(".ba").forEach((box) => {
      wireStandardBA(box);
      let openBtn = box.querySelector(".ba-open");
      if (!openBtn) {
        openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "ba-open";
        openBtn.setAttribute("aria-label", "Open before after full screen");
        openBtn.title = "Open full screen";
        openBtn.textContent = "⛶";
        box.appendChild(openBtn);
      }
      openBtn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const title = box.closest(".card")?.querySelector("h3")?.textContent?.trim() || box.closest("section")?.querySelector("h2")?.textContent?.trim() || "Before / After Preview";
        openStandardBA(box, title);
      });
    });

    document.querySelectorAll(".interactive-compare").forEach((box) => {
      wireInteractiveCompare(box);
      let openBtn = box.querySelector(".compare-open");
      if (!openBtn) {
        openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "compare-open";
        openBtn.setAttribute("aria-label", "Open decluttering before after full screen");
        openBtn.title = "Open full screen";
        openBtn.textContent = "⛶";
        box.appendChild(openBtn);
      }
      openBtn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const title = box.closest(".ba-card")?.querySelector("h3")?.textContent?.trim() || "Decluttering Before / After";
        openInteractiveCompare(box, title);
      });
    });
  }

  function initImageLightbox() {
    const selector = [".portfolio img", ".mixed-portfolio .item img", ".floorplan-gallery img", ".drone-gallery img", ".exterior-gallery img", ".interior-gallery img", ".service-visual img", ".visual img", "figure.item img", ".gallery img"].join(",");
    document.querySelectorAll(selector).forEach((img) => {
      if (img.closest(".ba, .interactive-compare")) return;
      img.classList.add("zoomable-img");
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      const open = (e) => { e.preventDefault(); openImage(img); };
      img.addEventListener("click", open);
      img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(e); });
    });
  }

  function initPortfolioFilters() {
    const buttons = document.querySelectorAll(".portfolio-filters button");
    const items = document.querySelectorAll(".mixed-portfolio .item[data-category]");
    if (!buttons.length || !items.length) return;
    buttons.forEach((btn) => btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      items.forEach((item) => item.classList.toggle("hide", !(filter === "all" || item.dataset.category === filter)));
    }));
  }

  function initLeadForm() {
    const form = document.getElementById("leadForm");
    if (!form) return;
    const status = document.getElementById("leadFormStatus");
    const submitBtn = document.getElementById("leadSubmitBtn");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const originalHTML = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = `<span class="lead-submit-main">Sending...</span><span class="lead-submit-sub">Please wait</span>`; }
      if (status) { status.className = "lead-form-status"; status.textContent = "Submitting your project..."; }
      try {
        const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data?.message || "Submission failed");
        if (status) { status.className = "lead-form-status success"; status.textContent = "Project request submitted successfully."; }
        form.reset();
        window.setTimeout(() => { window.location.href = "thank-you.html"; }, 650);
      } catch (error) {
        console.error("Web3Forms error:", error);
        if (status) { status.className = "lead-form-status error"; status.textContent = "Could not submit right now. Please check the share link and try again."; }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalHTML; }
      }
    });
  }

  onReady(() => { initBeforeAfter(); initImageLightbox(); initPortfolioFilters(); initLeadForm(); });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
