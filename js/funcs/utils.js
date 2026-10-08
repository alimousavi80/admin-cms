export {
    pagination,
    insertHtmlTemplate,
    receiveAllCourses,
    paginationButtonsHander,
    toeasNotificationtHandler,
    updateCoureHandler,
    newCoursePrepareForm,
    addNewCourseHandler,
    buttonHandler,
    modalHandler,
};

import { statsHandler } from "../shared.js";

const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWNteHJhY2Nrc3BwdWZwb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzY3MjUsImV4cCI6MjEwNjcxMjcyNX0.kEP8_cHV2uPuujkt_TvICmVd7y0H_U-KxrcQRAHIAjI";
const baseURL = "https://yzacmxraccksppufpokc.supabase.co";
const tableWrapper = document.querySelector("#table-wrapper");
const paginationWrapper = document.querySelector("#pagination-container");
const modalWrapper = document.querySelector("#modal-container");

let status = "در حال ضبط";

const receiveAllCourses = async () => {
    const res = await fetch(
        `${baseURL}/rest/v1/courses?select=*&order=created_at.desc`,
        {
            method: "GET",
            headers: {
                apikey: anonKey,
                Authorization: `Bearer ${anonKey}`,
            },
        },
    );

    const result = await res.json();

    return result;
};

const insertHtmlTemplate = (array, wrapper, pageCount = 1) => {
    wrapper.innerHTML = "";

    array.forEach((course, index) => {
        wrapper.insertAdjacentHTML(
            "beforeend",
            `                    
                <tr>
                    <td class="px-4 py-3 font-medium">
                        ${pageCount === 1 ? index + 1 : (pageCount - 1) * 5 + index + 1}
                    </td>
                    <td class="px-4 py-3 font-medium">
                        ${course.courseName}
                    </td>
                    <td class="px-4 py-3">${course.creator}</td>
                    <td class="px-4 py-3">
                        <span
                            class="neu-chip ${course.status === "تکمیل شده" ? "neu-chip-success" : "neu-chip-warning"}"
                            >${course.status}</span
                        >
                    </td>
                    <td
                        class="px-4 py-3 text-ink-muted"
                    >
                        ${course.price.toLocaleString()}
                    </td>
                    <td
                        class="px-4 py-3 text-ink-muted"
                    >
                        ${course.created_at.slice(0, 10)}
                            </br>
                        ${course.created_at.slice(11, 19)}
                    </td>
                    <td>
                        <button onclick="updateCoureHandler(${course.id})" type="button" class="neu-btn py-2 px-3 text-amber-700 dark:text-amber-400">
                            <svg class="size-6">
                                <use href="#edit-icon"></use>
                            </svg>
                        </button>
                    </td>                        
                    <td>
                        <button onclick="modalHandler('showDeleteWarning' , ${course.id}, '${course.courseName}')" type="button" class="neu-btn py-2 px-3 neu-chip-delete">
                            <svg class="size-6">
                                <use href="#trash-icon"></use>
                            </svg>
                        </button>
                    </td>                        
                </tr>   
            `,
        );
    });
};

const pagination = (
    array,
    paginationWrapper,
    itemsCountPerPage,
    currentPageNumber,
) => {
    let finishIndex = itemsCountPerPage * currentPageNumber;
    let startIndex = finishIndex - itemsCountPerPage;
    let paginatedItemsCount = Math.ceil(array.length / itemsCountPerPage);
    let paginatedArray = array.slice(startIndex, finishIndex);

    paginationWrapper.innerHTML = "";

    for (let i = 1; i <= paginatedItemsCount; i++) {
        paginationWrapper.insertAdjacentHTML(
            "beforeend",
            `
                <button onclick="paginationButtonsHander(${i})" class="neu-btn">${i}</button>
            `,
        );
    }

    return paginatedArray;
};

const paginationButtonsHander = (count) => {
    receiveAllCourses().then((courses) => {
        let paginatedCourses = pagination(courses, paginationWrapper, 5, count);
        insertHtmlTemplate(paginatedCourses, tableWrapper, count);
    });
};

const buttonHandler = (status) => {
    if (status === "open") {
        modalWrapper.classList.remove("hidden");
        modalWrapper.classList.add("flex");
    } else if (status === "close") {
        modalWrapper.classList.remove("flex");
        modalWrapper.classList.add("hidden");
    }
};
window.buttonHandler = buttonHandler;

const newCoursePrepareForm = () => {
    const recordingRadioItem = document.querySelector("#recording-radio-item");
    const completeRadioItem = document.querySelector("#complete-radio-item");

    completeRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
    });
    recordingRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
    });
};

const addNewCourseHandler = (event) => {
    event.preventDefault();

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

    fetch(`${baseURL}/rest/v1/courses`, {
        method: "POST",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status === 201) {
            statsHandler();
            buttonHandler("close");
            toeasNotificationtHandler("createCourse");
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
window.addNewCourseHandler = addNewCourseHandler;

const updateCoureHandler = (data) => {};
window.updateCoureHandler = updateCoureHandler;

const deleteCourseHandler = (couseId) => {
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWNteHJhY2Nrc3BwdWZwb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzY3MjUsImV4cCI6MjEwNjcxMjcyNX0.kEP8_cHV2uPuujkt_TvICmVd7y0H_U-KxrcQRAHIAjI";
    fetch(`${baseURL}/rest/v1/courses?id=eq.${couseId}`, {
        method: "DELETE",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Prefer: "return=representation",
        },
    }).then((res) => {
        if (res.status === 200) {
            toeasNotificationtHandler("deleteCourse");
            receiveAllCourses().then((data) => {
                let paginatedCourses = pagination(
                    data,
                    paginationWrapper,
                    5,
                    1,
                );
                insertHtmlTemplate(paginatedCourses, tableWrapper);
            });
            statsHandler();
        }
    });
};
window.deleteCourseHandler = deleteCourseHandler;

const toeasNotificationtHandler = (typeOfToeast) => {
    const toestElem = document.querySelector(".toest");
    const progressBar = document.querySelector(".progress");
    const progressText = document.querySelector("#progress-text");
    if (typeOfToeast === "deleteCourse") {
        progressText.innerHTML = "دوره با موفقعیت حذف شد";
    } else if (typeOfToeast === "createCourse") {
        progressText.innerHTML = "دوره با موفقعیت ساخته شد";
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
    }, 35);
};

const modalHandler = (modalType, courseId = 0, courseName = "") => {

    modalWrapper.innerHTML = "";
    if (modalType === "addCourse") {
        modalWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div dir="rtl" class="neu-card w-full max-w-md">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <h2 id="course-modal-title" class="text-lg font-semibold">
                        افزودن دوره
                    </h2>
                    <button onclick="buttonHandler('close')" type="button" class="neu-icon-btn close-modal-btn">
                        <svg class="size-7">
                            <use href="#x-mark-icon"></use>
                        </svg>
                    </button>
                </div>

                <form id="course-form" class="flex flex-col gap-6" novalidate>
                    <div class="flex flex-col gap-2">
                        <label for="course-name" class="text-sm font-medium"
                            >نام دوره</label
                        >
                        <input
                            id="course-name"
                            type="text"
                            class="neu-input"
                            placeholder="مثلاً: آموزش ری‌اکت"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="course-creator" class="text-sm font-medium"
                            >مدرس</label
                        >
                        <input
                            id="course-creator"
                            type="text"
                            class="neu-input"
                            placeholder="نام مدرس"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="course-price" class="text-sm font-medium"
                            >قیمت</label
                        >
                        <div class="relative">
                            <input
                                id="course-price"
                                type="number"
                                class="neu-input pe-16"
                                placeholder="5000000"
                                required
                            />
                            <span
                                class="pointer-events-none absolute inset-y-0 end-4 flex items-center text-sm text-ink-muted"
                                >تومان</span
                            >
                        </div>
                    </div>

                    <fieldset class="flex flex-col gap-3">
                        <legend class="mb-1 text-sm font-medium">وضعیت</legend>
                        <div class="flex gap-4">
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="تکمیل شده"
                                    class="peer sr-only"
                                    id="complete-radio-item"
                                    required
                                />
                                <span
                                    class="neu-chip neu-chip-success cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >تکمیل شده</span
                                >
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="در حال ضبط"
                                    class="peer sr-only"
                                    id="recording-radio-item"
                                />
                                <span
                                    class="neu-chip neu-chip-warning cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >در حال ضبط</span
                                >
                            </label>
                        </div>
                    </fieldset>

                    <p
                        id="form-error"
                        class="min-h-5 text-sm text-red-600 dark:text-red-400"
                    ></p>

                    <div class="flex gap-4">
                        <button
                            onclick="addNewCourseHandler(event)"
                            type="submit"
                            class="neu-btn neu-btn-accent"
                        >
                            ذخیره دوره
                        </button>
                        <button
                            type="button"
                            onclick="buttonHandler('close')"
                            class="neu-btn"
                        >
                            انصراف
                        </button>
                    </div>
                </form>
            </div>        
            `,
        );
    } else if (modalType === "showDeleteWarning") {
        modalWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div class="neu-card min-w-90 min-h-40">
                <p class="mb-8 text-center text-lg">
                    آیا از حذف دوره ${courseName} اطیمنان دارید؟
                </p>
                <div class="flex w-fit mx-auto gap-x-15">
                    <button
                        onclick="deleteCourseHandler(${courseId}), buttonHandler('close')"
                        type="button"
                        class="neu-btn neu-chip-delete"
                    >
                        حذف دوره
                    </button>
                    <button
                        type="button"
                        onclick="buttonHandler('close')"
                        class="neu-btn"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        `,
        );

        buttonHandler("open");
    }
};
window.modalHandler = modalHandler;
