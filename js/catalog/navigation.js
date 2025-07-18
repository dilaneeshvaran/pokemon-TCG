document.addEventListener("DOMContentLoaded", () => {
  const catalogBtn = document.getElementById("catalogBtn");

  if (catalogBtn) {
    catalogBtn.addEventListener("click", () => {
      window.location.href = "catalog.html";
    });
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const returnBtn = document.getElementById("returnBtn");

  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
})