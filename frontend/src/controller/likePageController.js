import { displayPost } from "../common/post/displayPost.js";
import { lightbox } from "../common/post/lightbox.js";

$(document).ready(async function () {
    execute();
});

async function execute(sort) {
    await displayPost();

    lightbox();
}
