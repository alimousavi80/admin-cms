export {
    pagination,
    insertHtmlTemplate,
    receiveAllUsers,
    newUserPrepareForm,
    buttonHandler,
    userModalHandler,
};

import { statsHandler, toeasNotificationtHandler } from "../shared.js";

const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWNteHJhY2Nrc3BwdWZwb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzY3MjUsImV4cCI6MjEwNjcxMjcyNX0.kEP8_cHV2uPuujkt_TvICmVd7y0H_U-KxrcQRAHIAjI";
const baseURL = "https://yzacmxraccksppufpokc.supabase.co";
const tableWrapper = document.querySelector("#table-wrapper");
const paginationWrapper = document.querySelector("#pagination-container");
const modalWrapper = document.querySelector("#modal-container");

let role = "commonuser";

const receiveAllUsers = async () => {
    const res = await fetch(
        `${baseURL}/rest/v1/users?select=*&order=created_at.desc`,
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

    array.forEach((user, index) => {
        wrapper.insertAdjacentHTML(
            "beforeend",
            `                    
                <tr>
                    <td class="px-4 py-3 font-medium">
                        ${pageCount === 1 ? index + 1 : (pageCount - 1) * 5 + index + 1}
                    </td>
                    <td class="px-4 py-3 font-medium">
                        ${user.fullName}
                    </td>
                    <td class="px-4 py-3">${user.userName}</td>
                    <td class="px-4 py-3">
                        <span
                            class="neu-chip ${user.role === "admin" ? "neu-chip-success" : "neu-chip-warning"}"
                            >${user.role === "admin" ? "مدیر" : "کاربر عادی"}
                        </span>
                    </td>
                    <td
                        class="px-4 py-3 text-ink-muted"
                    >
                        ${user.phoneNumber}
                    </td>
                    <td
                        class="px-4 py-3 text-ink-muted"
                    >
                        ${user.email}
                    </td>
                    <td>
                        <button onclick="userModalHandler('updateUser',${user.id}, '${user.fullName}', '${user.userName}', '${user.email}', ${user.phoneNumber}, '${user.role}')" type="button" class="neu-btn py-2 px-3 neu-chip-warning">
                            <svg class="size-6">
                                <use href="#edit-icon"></use>
                            </svg>
                        </button>
                    </td>                        
                    <td>
                        <button onclick="userModalHandler('showDeleteWarningUsers' , ${user.id}, '${user.fullName}')" type="button" class="neu-btn py-2 px-3 neu-chip-delete">
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
                <button onclick="usersPaginationButtonsHander(${i})" class="neu-btn">${i}</button>
            `,
        );
    }

    return paginatedArray;
};

const usersPaginationButtonsHander = (count) => {
    receiveAllUsers().then((users) => {
        let paginatedUsers = pagination(users, paginationWrapper, 5, count);
        insertHtmlTemplate(paginatedUsers, tableWrapper, count);
    });
};
window.usersPaginationButtonsHander = usersPaginationButtonsHander;

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

const newUserPrepareForm = () => {
    const adminRadioItem = document.querySelector("#admin-radio-item");
    const commonuserRadioItem = document.querySelector(
        "#commonuser-radio-item",
    );

    document.querySelector("#user-fullname");

    adminRadioItem.addEventListener("change", (e) => {
        role = e.target.value;
    });
    commonuserRadioItem.addEventListener("change", (e) => {
        role = e.target.value;
    });
};
window.newUserPrepareForm = newUserPrepareForm;

const addNewUserHandler = () => {
    const userFullName = document.querySelector("#user-fullname");
    const userUserName = document.querySelector("#user-username");
    const userEamil = document.querySelector("#user-email");
    const userPhoneNumber = document.querySelector("#user-phonenumber");

    const userData = {
        fullName: userFullName.value.trim(),
        userName: userUserName.value.trim(),
        role: role,
        phoneNumber: +userPhoneNumber.value,
        email: userEamil.value.trim(),
    };

    fetch(`${baseURL}/rest/v1/users`, {
        method: "POST",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(userData),
    }).then((res) => {
        if (res.status === 201) {
            statsHandler();
            buttonHandler("close");
            toeasNotificationtHandler("createUser", "users");
            receiveAllUsers().then((data) => {
                let paginatedUsers = pagination(data, paginationWrapper, 5, 1);
                insertHtmlTemplate(paginatedUsers, tableWrapper);
            });
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
        }
    });
};
window.addNewUserHandler = addNewUserHandler;

const updateUserHandler = (userId) => {
    const userFullName = document.querySelector("#user-fullname");
    const userUserName = document.querySelector("#user-username");
    const userEamil = document.querySelector("#user-email");
    const userPhoneNumber = document.querySelector("#user-phonenumber");

    const userData = {
        fullName: userFullName.value.trim(),
        userName: userUserName.value.trim(),
        role: role,
        phoneNumber: +userPhoneNumber.value,
        email: userEamil.value.trim(),
    };

    fetch(`${baseURL}/rest/v1/users?id=eq.${userId}`, {
        method: "PATCH",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(userData),
    }).then((res) => {
        if (res.status === 200) {
            buttonHandler("close");
            toeasNotificationtHandler("updateUser", "users");
            receiveAllUsers().then((data) => {
                let paginatedUsers = pagination(data, paginationWrapper, 5, 1);
                insertHtmlTemplate(paginatedUsers, tableWrapper);
                statsHandler();
            });
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
        }
    });
};
window.updateUserHandler = updateUserHandler;

const deleteUserHandler = (userId) => {
    fetch(`${baseURL}/rest/v1/users?id=eq.${userId}`, {
        method: "DELETE",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Prefer: "return=representation",
        },
    }).then((res) => {
        if (res.status === 200) {
            toeasNotificationtHandler("deleteUser", "users");
            receiveAllUsers().then((data) => {
                let paginatedUsers = pagination(data, paginationWrapper, 5, 1);
                insertHtmlTemplate(paginatedUsers, tableWrapper);
            });
            statsHandler();
        } else {
            buttonHandler("close");
            toeasNotificationtHandler("eror");
        }
    });
};
window.deleteUserHandler = deleteUserHandler;

const userModalHandler = (
    modalType,
    userId = 0,
    userFullName = "",
    userUserName = "",
    userEamil = "",
    userPhoneNumber = 0,
    userRole = "",
) => {
    modalWrapper.innerHTML = "";
    if (modalType === "addUser") {
        modalWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div dir="rtl" class="neu-card w-full max-w-md">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <h2 id="course-modal-title" class="text-lg font-semibold">
                        افزودن کاربر
                    </h2>
                    <button onclick="buttonHandler('close')" type="button" class="neu-icon-btn close-modal-btn">
                        <svg class="size-7">
                            <use href="#x-mark-icon"></use>
                        </svg>
                    </button>
                </div>

                <form id="course-form" class="flex flex-col gap-6" novalidate>
                    <div class="flex flex-col gap-2">
                        <label for="user-fullname" class="text-sm font-medium"
                            >نام و نام خانوادگی</label
                        >
                        <input
                            id="user-fullname"
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-username" class="text-sm font-medium"
                            >یوزرنیم</label
                        >
                        <input
                            id="user-username"
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-email" class="text-sm font-medium"
                            >ایمیل</label
                        >
                        <input
                            id="user-email"
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-phonenumber" class="text-sm font-medium"
                            >شماره تلفن</label
                        >
                        <input
                            id="user-phonenumber"
                            type="number"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <fieldset class="flex flex-col gap-3">
                        <legend class="mb-1 text-sm font-medium">نقش</legend>
                        <div class="flex gap-4">
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="admin"
                                    class="peer sr-only"
                                    id="admin-radio-item"
                                    required
                                />
                                <span
                                    class="neu-chip neu-chip-success cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >مدیر</span
                                >
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="commonuser"
                                    class="peer sr-only"
                                    id="commonuser-radio-item"
                                />
                                <span
                                    class="neu-chip neu-chip-warning cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >کاربر عادی</span
                                >
                            </label>
                        </div>
                    </fieldset>
                    <div class="flex justify-around mt-5">
                        <button
                            onclick="addNewUserHandler(event)"
                            type="button"
                            class="neu-btn neu-chip-success"
                        >
                            ذخیره کاربر
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
    } else if (modalType === "showDeleteWarningUsers") {
        modalWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div class="neu-card min-w-90 min-h-40">
                <p class="mb-8 text-center text-lg">
                    آیا از حذف کاربر ${userFullName} اطیمنان دارید؟
                </p>
                <div class="flex w-fit mx-auto gap-x-15">
                    <button
                        onclick="deleteUserHandler(${userId}), buttonHandler('close')"
                        type="button"
                        class="neu-btn neu-chip-delete"
                    >
                        حذف کاربر
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
    } else if (modalType === "updateUser") {
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
                            >نام و نام خانوادگی</label
                        >
                        <input
                            id="user-fullname"
                            value = '${userFullName}'
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-fullname" class="text-sm font-medium"
                            >یوزرنیم</label
                        >
                        <input
                            id="user-username"
                            value = '${userUserName}'
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-fullname" class="text-sm font-medium"
                            >تلفن همراه</label
                        >
                        <input
                            id="user-phonenumber"
                            value = '${userPhoneNumber}'
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="user-fullname" class="text-sm font-medium"
                            >ایمیل</label
                        >
                        <input
                            id="user-email"
                            value = '${userEamil}'
                            type="text"
                            class="neu-input"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <fieldset class="flex flex-col gap-3">
                        <legend class="mb-1 text-sm font-medium">وضعیت</legend>
                        <div class="flex gap-4">
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="admin"
                                    class="peer sr-only"
                                    id="admin-radio-item"
                                    ${userRole === "admin" ? "checked" : ""}
                                    required
                                />
                                <span
                                    class="neu-chip neu-chip-success cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >مدیر</span>
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="commonuser"
                                    class="peer sr-only"
                                    id="commonuser-radio-item"
                                    ${userRole !== "commonuser" ? "" : "checked"}
                                />
                                <span
                                    class="neu-chip neu-chip-warning cursor-pointer px-4 py-2 text-sm opacity-60 peer-checked:opacity-100 peer-checked:shadow-neu-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                                    >کاربر عادی</span
                                >
                            </label>
                        </div>
                    </fieldset>

                    <div class="flex justify-around">
                        <button
                            onclick="updateUserHandler(${userId})"
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
        newUserPrepareForm();
        buttonHandler("open");
    }
};
window.userModalHandler = userModalHandler;
