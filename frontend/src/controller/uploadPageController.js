import { displayPost } from "../common/post/displayPost.js";
import { lightbox } from "../common/post/lightbox.js";
import { upload } from "../api/post.js";

$(document).ready(async function () {
    execute();
});

async function execute(sort) {
    await displayPost();

    // image upload button clicked
    $(".upload-icon").click(() => {
        const input = $("#img-upload");
        input.click();
    });

    // detects change of image input
    $("#img-upload").on("change", (e) => {
        readURL(e);
    });

    // In Upload, complete text is clicked
    $(".complete-text").click((e) => {
        const imgSrc = $("#uploaded-img").attr("src");
        const description = $(".description").val();

        if (imgSrc == "#" || description == "") {
            $(".invalid-text").css("color", "red");
        } else {
            const navigate = () => {
                location.href = "../page/main.html";
            };

            upload(imgSrc, description, navigate);
        }
    });

    lightbox();
}

function readURL(e) {
    const input = e.currentTarget.files;

    if (input[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            $("#uploaded-img").attr("src", e.target.result);
            $("#uploaded-img").removeAttr("hidden");
            $(".img-upload").attr("hidden", true);
        };

        reader.readAsDataURL(input[0]);
    }
}
