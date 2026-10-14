import { receiveAllUsers } from "./funcs/users.js";
import { receiveAllCourses } from "./funcs/utils.js";
export { statsHandler, toeasNotificationtHandler };

const notificationBtn = document.querySelector("#notification-btn");
const notificationBox = document.querySelector("#notification-box");
const coursesCount = document.querySelector("#courses-count");
const usersCount = document.querySelector("#users-count");
const barsMenu = document.querySelector("#bars-menu");
const overlayMobile = document.querySelector("#overlay-mobile");
const sideMenuMobile = document.querySelector("#side-menu-mobile");
const closeMobileMenuBtn = document.querySelector("#close-mobile-menu-btn");

const statsHandler = () => {
    receiveAllCourses().then((data) => {
        coursesCount.innerHTML = +data.length;
    });
    receiveAllUsers().then((data) => {
        usersCount.innerHTML = +data.length;
    });
};

const toeasNotificationtHandler = (typeOfToeast, position = "users") => {
    const toestElem = document.querySelector(".toest");
    const progressBar = document.querySelector(".progress");
    const progressText = document.querySelector("#progress-text");

    if (position === "courses") {
        if (typeOfToeast === "deleteCourse") {
            progressText.innerHTML = "دوره با موفقعیت حذف شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "createCourse") {
            progressText.innerHTML = "دوره با موفقعیت ساخته شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "updateCourse") {
            progressText.innerHTML = "دوره با موفقعیت ویرایش شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "eror") {
            progressText.innerHTML = "خطا رخ داده است";
            progressBar.classList.remove(
                "bg-emerald-700",
                "dark:bg-emerald-400",
            );
            progressBar.classList.add("bg-amber-700", "dark:bg-amber-400");
        }
    } else if (position === "users") {
        if (typeOfToeast === "deleteUser") {
            progressText.innerHTML = "کاربر با موفقعیت حذف شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "createUser") {
            progressText.innerHTML = "کاربر با موفقعیت ساخته شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "updateUser") {
            progressText.innerHTML = "کاربر با موفقعیت ویرایش شد";
            progressBar.classList.remove("bg-amber-700", "dark:bg-amber-400");
            progressBar.classList.add("bg-emerald-700", "dark:bg-emerald-400");
        } else if (typeOfToeast === "eror") {
            progressText.innerHTML = "خطا رخ داده است";
            progressBar.classList.remove(
                "bg-emerald-700",
                "dark:bg-emerald-400",
            );
            progressBar.classList.add("bg-amber-700", "dark:bg-amber-400");
        }
    }

    toestElem.classList.remove("hidden");

    let progressWidth = 0;

    const interval = setInterval(function () {
        progressWidth++;
        progressBar.style.width = `${progressWidth}%`;
        if (progressWidth === 100) {
            clearInterval(interval);
            progressBar.style.width = "0%";
            toestElem.classList.add("hidden");
        }
    }, 30);
};

const showMobileMenuHandler = () => {
    sideMenuMobile.classList.remove("translate-x-70");
    sideMenuMobile.classList.add("translate-x-0");
    overlayMobile.classList.remove("opacity-0", "pointer-events-none");
    overlayMobile.classList.add("opacity-100");
};

const hideMobileMenuHandler = () => {
    sideMenuMobile.classList.add("translate-x-70");
    sideMenuMobile.classList.remove("translate-x-0");
    overlayMobile.classList.add("opacity-0", "pointer-events-none");
    overlayMobile.classList.remove("opacity-100");
};

window.addEventListener("load", () => {
    statsHandler();
});

barsMenu.addEventListener("click", showMobileMenuHandler);
closeMobileMenuBtn.addEventListener("click", hideMobileMenuHandler);
overlayMobile.addEventListener("click", (e) => {
    if (e.target.classList.contains("fixed")) {
        hideMobileMenuHandler();
    }
});
notificationBtn.addEventListener("click", () =>
    notificationBox.classList.remove("hidden"),
);
notificationBox.addEventListener("mouseleave", () =>
    notificationBox.classList.add("hidden"),
);
