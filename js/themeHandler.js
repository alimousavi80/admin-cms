const htmlElem = document.documentElement;
const themeBtn = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");

let theme = "light";

if (savedTheme) {
    theme = savedTheme;
}

function changeTheme() {
    if (theme === "light") {
        theme = "dark";
        localStorage.setItem("theme", theme);
        htmlElem.className = "dark";
    } else {
        theme = "light";
        localStorage.setItem("theme", theme);
        htmlElem.className = "light";
    }
}

themeBtn.addEventListener("click", changeTheme);
