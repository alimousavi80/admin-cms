export {
    pagination,
    insertHtmlTemplate,
    receiveAllCourses,
    paginationButtonsHander,
    toeasNotificationtHandler,
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
                        <button onclick="modalHandler('updateCourse', ${course.id}, '${course.courseName}', '${course.creator}', ${course.price}, '${course.status}'), newCoursePrepareForm()" type="button" class="neu-btn py-2 px-3 text-amber-700 dark:text-amber-400">
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

    document.querySelector("#course-name").focus();

    completeRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
    });
    recordingRadioItem.addEventListener("change", (e) => {
        status = e.target.value;
    });
};
window.newCoursePrepareForm = newCoursePrepareForm;

const addNewCourseHandler = () => {
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
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
        }
    });
};
window.addNewCourseHandler = addNewCourseHandler;

const updateCourseHandler = (courseId) => {
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

    fetch(`${baseURL}/rest/v1/courses?id=eq.${courseId}`, {
        method: "PATCH",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status === 200) {
            buttonHandler("close");
            toeasNotificationtHandler("updateCourse");
            receiveAllCourses().then((data) => {
                let paginatedCourses = pagination(
                    data,
                    paginationWrapper,
                    5,
                    1,
                );
                insertHtmlTemplate(paginatedCourses, tableWrapper);
                statsHandler();
            });
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
        }
    });
};
window.updateCourseHandler = updateCourseHandler;

const deleteCourseHandler = (couseId) => {
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
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
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
        progressBar.classList.remove("bg-emerald-700", "dark:bg-emerald-400");
        progressBar.classList.add("bg-amber-700", "dark:bg-amber-400");
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

const modalHandler = (
    modalType,
    courseId = 0,
    courseName = "",
    courseCreator = "",
    coursePrice = 0,
    courseStatus = "",
) => {
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
                            <input
                                oninput="priceCounter(event)"
                                id="course-price"
                                type="text"
                                inputmode="numeric"
                                class="neu-input pe-1"
                                placeholder="5000000"
                                required
                            />
                            <div class="flex justify-between">
            
                            <span
                                id="price-counter"
                                class="pointer-events-none min-h-5 flex items-center text-sm text-ink-muted"
                                ></span
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
                    <div class="flex justify-around mt-5">
                        <button
                            onclick="addNewCourseHandler(event)"
                            type="button"
                            class="neu-btn neu-chip-success"
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
    } else if (modalType === "updateCourse") {
        modalWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div dir="rtl" class="neu-card w-full max-w-md">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <h2 id="course-modal-title" class="text-lg font-semibold">
                        ویرایش دوره
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
                            value = '${courseName}'
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
                            value = '${courseCreator}'
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
                            <input
                                oninput="priceCounter(event)"
                                id="course-price"
                                value = ${coursePrice}
                                type="text"
                                inputmode="numeric"
                                class="neu-input pe-16"
                                placeholder="5000000"
                                required
                            />
                            <span
                                id = "price-counter"
                                class="pointer-events-none min-h-5 flex items-center text-sm text-ink-muted"
                                ></span
                            >
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
                                    ${courseStatus === "تکمیل شده" ? "checked" : ""}
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
                                    ${courseStatus === "تکمیل شده" ? "" : "checked"}
                                />
                                <span
                                    class="neu-chip neu-chip-warning cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >در حال ضبط</span
                                >
                            </label>
                        </div>
                    </fieldset>

                    <div class="flex justify-around">
                        <button
                            onclick="updateCourseHandler(${courseId})"
                            type="button"
                            class="neu-btn neu-chip-warning"
                        >
                           ویرایش
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
        buttonHandler("open");
    }
};
window.modalHandler = modalHandler;

const priceCounter = (e) => {
    const ones = [
        "",
        "یک",
        "دو",
        "سه",
        "چهار",
        "پنج",
        "شش",
        "هفت",
        "هشت",
        "نه",
        "ده",
        "یازده",
        "دوازده",
        "سیزده",
        "چهارده",
        "پانزده",
        "شانزده",
        "هفده",
        "هجده",
        "نوزده",
    ];
    const tens = [
        "",
        "",
        "بیست",
        "سی",
        "چهل",
        "پنجاه",
        "شصت",
        "هفتاد",
        "هشتاد",
        "نود",
    ];
    const hundreds = [
        "",
        "صد",
        "دویست",
        "سیصد",
        "چهارصد",
        "پانصد",
        "ششصد",
        "هفتصد",
        "هشتصد",
        "نهصد",
    ];
    const scales = ["", "هزار", "میلیون", "میلیارد"];

    const threeDigits = (n) => {
        const parts = [];
        if (n >= 100) parts.push(hundreds[Math.floor(n / 100)]);
        n %= 100;
        if (n >= 20) {
            parts.push(tens[Math.floor(n / 10)]);
            n %= 10;
        }
        if (n > 0) parts.push(ones[n]);
        return parts.join(" و ");
    };

    const numberToWords = (num) => {
        if (num === 0) return "صفر";
        const parts = [];
        let i = 0;
        while (num > 0) {
            const chunk = num % 1000;
            if (chunk)
                parts.unshift((threeDigits(chunk) + " " + scales[i]).trim());
            num = Math.floor(num / 1000);
            i++;
        }
        return parts.join(" و ");
    };

    const el = document.querySelector("#price-counter");

    // ارقام فارسی و عربی را به انگلیسی تبدیل می‌کنیم
    const fixed = e.target.value
        .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776)
        .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632);

    // هر چیزی غیر از رقم (نقطه، ویرگول، حروف، منفی) حذف می‌شود
    // و حداکثر ۱۲ رقم (تا هزار میلیارد) مجاز است
    const digits = fixed.replace(/\D/g, "").slice(0, 12);
    e.target.value = digits;

    el.textContent = digits ? numberToWords(Number(digits)) + " تومان" : "";
};
window.priceCounter = priceCounter;
