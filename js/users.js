import {
    insertHtmlTemplate,
    pagination,
    receiveAllUsers,
    newUserPrepareForm,
    buttonHandler,
    userModalHandler,
} from "./funcs/users.js";


const tableWrapper = document.querySelector("#table-wrapper");
const paginationWrapper = document.querySelector("#pagination-container");
const openAddCourseModal = document.querySelector("#open-modal-btn");
const modalCountanerElem = document.querySelector("#modal-container");

window.addEventListener("load", () => {
    receiveAllUsers().then((data) => {
        let paginatedCourses = pagination(data, paginationWrapper, 5, 1);
        insertHtmlTemplate(paginatedCourses, tableWrapper);
    });
});

openAddCourseModal.addEventListener("click", () => {
    userModalHandler("addUser");
    buttonHandler("open");
    newUserPrepareForm();
});
