import { login } from "../api/user.js";

$(document).ready(async function () {
    execute();
});

async function execute(sort) {
    // signup text is clicked!
    $(".signup-text").click(() => {
        location.href = "../page/signup.html";
    });

    // login button is clicked!
    $(".login-form").submit((event) => {
        event.preventDefault();

        const form = $(".login-form").get(0);

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const email = $("#login-email").val();
        const password = $("#login-pw").val();

        const navigate = () => {
            location.href = "../page/main.html";
        };

        login(email, password, navigate);
    });
}
