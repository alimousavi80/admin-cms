export {
    pagination,
    insertHtmlTemplate,
    receiveAllCourses,
    paginationButtonsHander,
    toeasNotificationtHandler,
};

const insertHtmlTemplate = (array, wrapper) => {
    wrapper.innerHTML = "";

    array.forEach((course) => {
        wrapper.insertAdjacentHTML(
            "beforeend",
            `                    
                <tr>
                    <td class="px-4 py-3 font-medium">
                        ${course.id}
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
                </tr>   
            `,
        );
    });
};

const paginationButtonsHander = (count) => {
    const tableWrapper = document.querySelector("#table-wrapper");
    const paginationWrapper = document.querySelector("#pagination-container");

    receiveAllCourses().then((courses) => {
        let paginatedCourses = pagination(courses, paginationWrapper, 5, count);
        insertHtmlTemplate(paginatedCourses, tableWrapper, count);
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

const receiveAllCourses = async () => {
    const res = await fetch(
        `https://yzacmxraccksppufpokc.supabase.co/rest/v1/courses`,
        {
            headers: {
                apikey: "sb_publishable_V41SKYZQA-pRjWlRtFydlw_3_xgLo6Y",
                Authorization: `Bearer sb_publishable_V41SKYZQA-pRjWlRtFydlw_3_xgLo6Y`,
            },
        },
    );

    const result = await res.json();

    return result;
};

const toeasNotificationtHandler = () => {
    const toestElem = document.querySelector(".toest");
    const progressBar = document.querySelector(".progress");

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
    }, 25);
};
