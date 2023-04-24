import { loadImage } from "../../util/utils.js";
import { searchPosts } from "../../api/post.js";

const sorts = {
    SORT_BY_TIME: 0,
    SORT_BY_LIKE: 1,
};

const pageData = {
    "main.html": {
        sort: sorts["SORT_BY_TIME"],
        follow: false,
        like: false,
    },
    "follow.html": {
        sort: sorts["SORT_BY_TIME"],
        follow: true,
        like: false,
    },
    "like.html": {
        sort: sorts["SORT_BY_TIME"],
        follow: false,
        like: true,
    },
};

async function displayPost(sort_string) {
    const currentUrl = location.pathname.split("/")[3];

    if (currentUrl in pageData) {
        let sort = pageData[currentUrl]["sort"];
        const follow = pageData[currentUrl]["follow"];
        const like = pageData[currentUrl]["like"];

        if (sort_string !== undefined) {
            sort = sorts[sort_string];
        }
        const data = await searchPosts(sort, follow, like);

        await displayPostFromData(data);
    }
}

async function displayPostFromData(data) {
    let left_height = 0,
        right_height = 0;

    let container, height;

    for (const item of data["data"]) {
        const imgSrc = item["imgSrc"];
        const like = item["like"];
        const view = item["view"];
        const id = item["id"];

        // decide to locate a post in left or right side
        // locate a post in left side
        if (left_height <= right_height) {
            container = $(".col-container").eq(0);
            container.append(getPost(id, imgSrc, like, view));

            height = await loadImage(imgSrc);

            left_height += Number(height);
        }
        // locate a post in right side
        else {
            container = $(".col-container").eq(1);
            container.append(getPost(id, imgSrc, like, view));

            height = await loadImage(imgSrc);

            right_height += Number(height);
        }
    }
}

// image container
function getPost(id, imgSrc, like, view) {
    return `
    <div class="img-container">
        <img
            id=${id}
            class="pet-img"
            src=${imgSrc}
        />
        <div class="info-container">
            <div class="icon-container">
                <span
                    id="like-icon"
                    class="material-symbols-outlined"
                >
                    favorite
                </span>
                <span class="number">${like}</span>
            </div>
            <div class="icon-container">
                <span class="material-symbols-outlined">
                    visibility
                </span>
                <span class="number">${view}</span>
            </div>
    </div>`;
}

export { displayPost, displayPostFromData };
