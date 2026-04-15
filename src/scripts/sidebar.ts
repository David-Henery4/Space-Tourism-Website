let isSidebarOpen = false;

const sidebarElement = document.getElementById("sidebar-element");
const overlayElement = document.getElementById("background-overlay");
const burgerIcon = document.getElementById("burger-icon");
const crossIcon = document.getElementById("cross-icon");

const toggleSidebar = (status: "OPEN" | "CLOSED") => {
  if (!sidebarElement) return;
  if (!overlayElement) return;
  if (status === "OPEN"){
    sidebarElement.style.transform = "translateX(-100%)";
    overlayElement.style.transform = "translateX(-100%)";
    return
  }
  sidebarElement.style.transform = "translateX(100%)";
  overlayElement.style.transform = "translateX(100%)";
}

burgerIcon?.addEventListener("click", () => toggleSidebar("OPEN"))

crossIcon?.addEventListener("click", () => toggleSidebar("CLOSED"))

overlayElement?.addEventListener("click", () => toggleSidebar("CLOSED"))