(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const loadingScreen = $("#loadingScreen");

  // Dark mode toggle
  const darkToggle = $("#darkModeToggle");
  function applyTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem("coffee_theme", theme);
    } catch (_) {}
  }
  function initTheme() {
    let theme = "dark";
    try {
      const saved = localStorage.getItem("coffee_theme");
      if (saved === "light") theme = "light";
    } catch (_) {}
    applyTheme(theme);
  }
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const next = document.body.classList.contains("light") ? "dark" : "light";
      applyTheme(next);
      showToast("Đã chuyển chế độ giao diện", "success");
    });
  }

  // Toastify
  function toastify(message, type = "info") {
    if (!window.Toastify) return alert(message);
    const bg =
      type === "success" ? "#16a34a" : type === "error" ? "#ef4444" : "#f59e0b";
    Toastify({
      text: message,
      duration: 2400,
      gravity: "bottom",
      position: "right",
      backgroundColor: bg,
      stopOnFocus: true,
      style: { borderRadius: "18px", fontWeight: 800 },
      className: "toast-modern",
    }).showToast();
  }

  function showToast(message, type) {
    // Prefer Toastify; fallback to alert
    toastify(message, type);
  }

  // Loading: fade skeleton quickly (client-side demo)
  function initLoading() {
    if (loadingScreen) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          loadingScreen.classList.add("loaded");
        }, 300);
      });
    }
  }

  // Realtime search + filter
  const searchInput = $("#searchInput");
  const categorySelect = $("#categorySelect");
  const statusSelect = $("#statusSelect");

  const productGrid = $("#productGrid");
  const skeleton = $("#skeleton");

  function buildQuery() {
    const keyword = (searchInput?.value || "").trim();
    const category = categorySelect?.value || "";
    const status = statusSelect?.value || "active";
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (category) params.set("category", category);
    if (status === "out_of_stock") {
      // demo: out_of_stock isn't mapped in server filters (server uses status=active)
      // Still keep UI consistent; server returns active only.
      // We'll just pass through; if backend doesn't handle, page will be empty.
      params.set("status", "out_of_stock");
    }
    return params;
  }

  let typingTimer = null;
  const DEBOUNCE = 250;

  async function applyFiltersToServer() {
    if (!searchInput) return;

    if (skeleton) skeleton.classList.remove("d-none");
    if (productGrid) productGrid.classList.add("d-none");

    const params = buildQuery();
    const url = "/client" + (params.toString() ? `?${params.toString()}` : "");

    // navigate
    window.location.href = url;
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => applyFiltersToServer(), DEBOUNCE);
    });
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", () => applyFiltersToServer());
  }
  if (statusSelect) {
    statusSelect.addEventListener("change", () => applyFiltersToServer());
  }

  // Clear search
  const clearBtn = $("#clearSearchBtn");
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      applyFiltersToServer();
    });
  }

  // Confirm popup (demo) for order buttons
  $$(".btn-order").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const name = btn.getAttribute("data-name") || "Món cà phê";
      if (!window.Swal) {
        showToast(`Đặt ngay: ${name}`, "success");
        return;
      }

      const result = await Swal.fire({
        title: "Đặt ngay?",
        text: `Bạn có chắc muốn đặt: ${name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#f08a2b",
      });

      if (result.isConfirmed) {
        showToast("Đặt hàng thành công (demo) ☕", "success");
      }
    });
  });

  // Scroll to top button
  const toTop = document.getElementById("toTopBtn");
  if (toTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    });
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  // Init
  initTheme();
  initLoading();
})();
