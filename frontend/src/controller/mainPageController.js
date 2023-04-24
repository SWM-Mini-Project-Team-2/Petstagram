import { displayPost } from "../common/post/displayPost.js";
import { lightbox } from "../common/post/lightbox.js";

$(document).ready(async function () {
    // sort option is changed
    $(".sort-select").change(async () => {
        const sort = $(".sort-select  option:selected").val();
        $(".col-container").eq(0).empty();
        $(".col-container").eq(1).empty();

        execute(sort);
    });

    execute();
});

async function execute(sort) {
    await displayPost(sort);

    lightbox();
}
