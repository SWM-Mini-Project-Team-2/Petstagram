const url = "http://localhost:8000/user";

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
            console.log(data);
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
