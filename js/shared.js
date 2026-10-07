import { receiveAllCourses } from "./funcs/utils.js";

const notificationBtn = document.querySelector("#notification-btn");
const notificationBox = document.querySelector("#notification-box");
const coursesCount = document.querySelector("#courses-count");
// const usersCount = document.querySelector("#users-count");

window.addEventListener("load", () => {
    receiveAllCourses().then((data) => {
        coursesCount.innerHTML = +data.length;
    });
});

notificationBtn.addEventListener("click", () =>
    notificationBox.classList.remove("hidden"),
);
notificationBox.addEventListener("mouseleave", () =>
    notificationBox.classList.add("hidden"),
);
