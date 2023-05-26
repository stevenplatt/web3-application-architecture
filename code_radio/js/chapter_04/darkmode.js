// this javascript adds dark mode and local storage functionality to Code Radio

const btn = document.querySelector(".btn-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
    document.body.classList.add("dark-theme");
}

btn.addEventListener("click", toggle_theme);

function toggle_theme() {
    document.body.classList.toggle("dark-theme");

    let theme = "light";
    if (document.body.classList.contains("dark-theme")) {
        theme = "dark";
    }
    localStorage.setItem("theme", theme);
}