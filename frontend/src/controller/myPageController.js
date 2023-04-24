import { deletePost, searchMyPosts } from "../api/post.js";
import { getMyName } from "../api/user.js";
import { displayPostFromData } from "../common/post/displayPost.js";
import { clickedPostID, lightbox } from "../common/post/lightbox.js";

$(document).ready(async function () {
    execute();
});

async function execute(sort) {
    // display posts of the page
    const data = await searchMyPosts();
    await displayPostFromData(data);
    await displayMyPageInfo(data.postNum);

    lightbox();

    // delete text in lightbox is clicked
    // delete the post and refresh the page
    $(".lightbox-delete-text").click(async () => {
        await deletePost(clickedPostID);
        location.reload();
    });
}

async function displayMyPageInfo(postNum) {
    const userName = await getMyName();
    const numPosts = postNum;

    const myName = $(".my-name");
    const myPost = $(".my-post");

    myName.text(userName);
    myPost.text(numPosts);
}
