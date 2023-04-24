import {
    searchPost,
    likePost,
    checkPostLiked,
    checkPostFollwed,
} from "../../api/post.js";
import { followUser } from "../../api/user.js";

let clickedPostID = -1;

// REFERENCE: https://www.patreon.com/posts/40159125
function lightbox() {
    // set lightbox img max height
    const wHeight = $(window).height();
    $(".lightbox-img").css("max-height", wHeight + "px");

    // lightbox
    $(".pet-img").click(async function () {
        const postId = $(this).attr("id");
        const data = await searchPost(postId);
        const jsonData = data["data"];

        clickedPostID = postId;

        // check whether the user liked the post
        const isLiked = await checkPostLiked(postId);

        // check whether the user followed the user of the post
        const isFollowed = await checkPostFollwed(postId);

        $(".lightbox").addClass("open");
        lightboxSlideShow(
            jsonData["imgSrc"],
            jsonData["userName"],
            jsonData["description"],
            jsonData["like"],
            jsonData["view"],
            isLiked,
            isFollowed,
            jsonData["userId"]
        );
    });

    // close lightbox when clicked outside of img-box
    $(".lightbox").click(async function (event) {
        if ($(event.target).hasClass("lightbox")) {
            const likes = $(".like-number").text();
            const views = $(".view-number").text();

            const updatedPost = $(`#${clickedPostID}`)
                .parent()
                .find(".info-container")
                .find(".icon-container");

            // update likes and views
            updatedPost.eq(0).find(".number").text(likes);
            updatedPost.eq(1).find(".number").text(views);

            $(this).removeClass("open");
        }
    });

    // like button clicked
    $(".like-btn").click(async () => {
        const res = await likePost(clickedPostID);
        const likes = res.like;
        const liked = res.liked;

        // update likes
        $(".like-number").text(likes);

        // change thumb color to red
        if (liked) {
            $(".like-btn").css("color", "red");
        } else {
            $(".like-btn").css("color", "black");
        }
    });

    // follow button clicked
    $(".follow-btn").click(async () => {
        const userId = $(".account-name").attr("id");
        const isFollowed = await followUser(userId);

        // update add to remove
        if (isFollowed) {
            $(".follow-btn").text("remove");
        } else {
            $(".follow-btn").text("add");
        }
    });
}

// show lightbox
function lightboxSlideShow(
    imgSrc,
    name,
    description,
    likes,
    views,
    isLiked,
    isFollowed,
    userId
) {
    $(".account-name").text(name);
    $(".account-name").attr("id", userId);
    $(".lightbox-description").text(description);
    $(".lightbox-img").attr("src", imgSrc);
    $(".like-number").text(likes);
    $(".view-number").text(views);

    if (isLiked) {
        $(".like-btn").css("color", "red");
    } else {
        $(".like-btn").css("color", "black");
    }

    if (isFollowed === true) {
        $(".follow-btn").attr("hidden", false);
        $(".follow-btn").text("remove");
    } else if (isFollowed === false) {
        $(".follow-btn").attr("hidden", false);
        $(".follow-btn").text("add");
    } else {
        $(".follow-btn").attr("hidden", true);
    }
}

export { lightbox, clickedPostID };
