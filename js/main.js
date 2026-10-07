import {
    insertHtmlTemplate,
    pagination,
    receiveAllCourses,
    paginationButtonsHander,
    toeasNotificationtHandler,
} from "./funcs/utils.js";

window.paginationButtonsHander = paginationButtonsHander;

const tableWrapper = document.querySelector("#table-wrapper");
const paginationWrapper = document.querySelector("#pagination-container");
const openAddCourseModal = document.querySelector("#open-modal-btn");
const modal = document.querySelector("#modal");
const closeModalBtn = document.querySelectorAll(".close-modal-btn");
const addCourseBtn = document.querySelector("#add-course-btn");

let status = "در حال ضبط";

window.addEventListener("load", () => {
    receiveAllCourses().then((data) => {
        let paginatedCourses = pagination(data, paginationWrapper, 5, 1);
        insertHtmlTemplate(paginatedCourses, tableWrapper);
    });
});

const newCoursePrepareForm = () => {
    const completeRadioItem = document.querySelector("#complete-radio-item");
    const recordingRadioItem = document.querySelector("#recording-radio-item");

    completeRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
    });
    recordingRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
        console.log(status);
    });
};

const addNewCourseHandler = (e) => {
    e.preventDefault();
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWNteHJhY2Nrc3BwdWZwb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzY3MjUsImV4cCI6MjEwNjcxMjcyNX0.kEP8_cHV2uPuujkt_TvICmVd7y0H_U-KxrcQRAHIAjI";

    const courseName = document.querySelector("#course-name");
    const courseCreator = document.querySelector("#course-creator");
    const coursePrice = document.querySelector("#course-price");

    const data = {
        courseName: courseName.value.trim(),
        creator: courseCreator.value.trim(),
        price: +coursePrice.value.trim(),
        status: status,
        category: "فرانت اند",
    };

    fetch(`https://yzacmxraccksppufpokc.supabase.co/rest/v1/courses`, {
        method: "POST",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        console.log(res);
        if (res.status === 201) {
            buttonHandler("close");
            toeasNotificationtHandler();
            receiveAllCourses().then((data) => {
                let paginatedCourses = pagination(
                    data,
                    paginationWrapper,
                    5,
                    1,
                );
                insertHtmlTemplate(paginatedCourses, tableWrapper);
            });
        }
        return res.json();
    });
};

const buttonHandler = (status) => {
    if (status === "open") {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    } else if (status === "close") {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    }
};

openAddCourseModal.addEventListener("click", () => {
    buttonHandler("open");
    newCoursePrepareForm();
});
closeModalBtn.forEach((item) => {
    item.addEventListener("click", () => buttonHandler("close"));
});

addCourseBtn.addEventListener("click", addNewCourseHandler);
