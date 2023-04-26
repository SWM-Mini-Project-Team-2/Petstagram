const url =
    "https://port-0-petstagram-17xqnr2llgvnc72n.sel3.cloudtype.app/user";

// GET /user
// login a user
const login = (email, password, func) => {
    return $.ajax({
        url: url + "/login",
        xhrFields: {
            withCredentials: true,
        },
        type: "post",
        data: { email, password },
    }).then(
        (data, textStatus, jqXHR) => {
            window.localStorage.setItem("cookie", data["token"]);
            if (data["data"] == "wrong") {
                $(".incorrect-login").css("color", "red");
            } else {
                func();
            }
        },
        (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    );
};

// POST /user
// signup a user
const signup = (email, name, password, func) => {
    return $.ajax({
        url: url + "/",
        type: "post",
        data: { email, name, password },
    }).then(
        (data, textStatus, jqXHR) => {
            console.log(data);
            func();
        },
        (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    );
};

// POST /user/duplicate
// check duplication of email
const checkDuplication = (email) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/duplicate",
            type: "post",
            xhrFields: {
                withCredentials: true,
            },
            data: { email },
            success: (res) => {
                resolve(JSON.parse(res.data));
            },
            error: (e) => {
                reject(e);
            },
        });
    });
};

// POST /user/:userId/follow
// follow a user
const followUser = (userId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/${userId}/follow`,
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

// GET /user/myname
// get my name
const getMyName = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${url}/myname`,
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

export { login, signup, checkDuplication, followUser, getMyName };
