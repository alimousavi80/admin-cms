import { receiveAllCourses } from "./funcs/utils.js";
export { statsHandler };

const notificationBtn = document.querySelector("#notification-btn");
const notificationBox = document.querySelector("#notification-box");
const coursesCount = document.querySelector("#courses-count");
// const usersCount = document.querySelector("#users-count");

const statsHandler = () => {
    receiveAllCourses().then((data) => {
        coursesCount.innerHTML = +data.length;
    });
};

window.addEventListener("load", () => {
    statsHandler();
});

notificationBtn.addEventListener("click", () =>
    notificationBox.classList.remove("hidden"),
);
notificationBox.addEventListener("mouseleave", () =>
    notificationBox.classList.add("hidden"),
);
