const url =
    "https://port-0-petstagram-17xqnr2llgvnc72n.sel3.cloudtype.app/post";

// GET /post
// search all posts
const searchPosts = (sort, follow, like) => {
    let params = "sort=" + sort;
    params += "&follow=" + follow;
    params += "&like=" + like;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "?" + params,
            type: "get",
            xhrFields: {
                withCredentials: true,
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + window.localStorage.getItem("cookie")
                );
            },
            success: (res) => {
                resolve(res);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// GET /post/my
// search my posts
const searchMyPosts = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/my",
            type: "get",
            xhrFields: {
                withCredentials: true,
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + window.localStorage.getItem("cookie")
                );
            },
            success: (res) => {
                resolve(res);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// GET /post/:postId
// search a post by postId
const searchPost = (postId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/" + postId,
            type: "get",
            success: (res) => {
                resolve(res);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// POST /post
// upload a post
const upload = (imgSrc, description, func) => {
    return $.ajax({
        url: url + "/",
        type: "post",
        xhrFields: {
            withCredentials: true,
        },
        beforeSend: (xhr) => {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + window.localStorage.getItem("cookie")
            );
        },
        data: { imgSrc, description },
    }).then(
        (data, textStatus, jqXHR) => {
            func();
        },
        (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    );
};

// POST /post/:postId/like
// like a post
const likePost = (postId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/${postId}/like`,
            type: "post",
            xhrFields: {
                withCredentials: true,
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + window.localStorage.getItem("cookie")
                );
            },
            success: (res) => {
                resolve(res.data);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// GET /post/:postId/like
// check whether the user liked the post
const checkPostLiked = (postId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/${postId}/like`,
            type: "get",
            xhrFields: {
                withCredentials: true,
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + window.localStorage.getItem("cookie")
                );
            },
            success: (res) => {
                resolve(res.data);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// GET /post/:postId/follow
// check whether the user followed the user of the post
const checkPostFollwed = (postId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/${postId}/follow`,
            type: "get",
            xhrFields: {
                withCredentials: true,
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + window.localStorage.getItem("cookie")
                );
            },
            success: (res) => {
                resolve(res.data);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// DELETE /post/:postId
// delete the clicked post
const deletePost = (postId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/${postId}`,
            type: "delete",
            xhrFields: {
                withCredentials: true,
            },
            success: (res) => {
                resolve(res);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

export {
    searchPosts,
    searchMyPosts,
    searchPost,
    upload,
    likePost,
    checkPostLiked,
    checkPostFollwed,
    deletePost,
};
