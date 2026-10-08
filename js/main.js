import {
    insertHtmlTemplate,
    pagination,
    receiveAllCourses,
    paginationButtonsHander,
    toeasNotificationtHandler,
    newCoursePrepareForm,
    addNewCourseHandler,
    buttonHandler,
    modalHandler,
} from "./funcs/utils.js";

window.paginationButtonsHander = paginationButtonsHander;

const tableWrapper = document.querySelector("#table-wrapper");
const paginationWrapper = document.querySelector("#pagination-container");
const openAddCourseModal = document.querySelector("#open-modal-btn");
const modalCountanerElem = document.querySelector("#modal-container");

window.addEventListener("load", () => {
    receiveAllCourses().then((data) => {
        let paginatedCourses = pagination(data, paginationWrapper, 5, 1);
        insertHtmlTemplate(paginatedCourses, tableWrapper);
    });
});

openAddCourseModal.addEventListener("click", () => {
    modalHandler("addCourse");
    newCoursePrepareForm();
    buttonHandler("open");
});
