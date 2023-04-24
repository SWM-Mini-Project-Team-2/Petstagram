import { signup, checkDuplication } from "../api/user.js";

let duplicationChecked = false;

// check confirmed password and password are same
const checkPasswordConfimred = () => {
    const pw = $("#signup-pw");
    const confirmPw = $("#signup-confirm-pw");

    if (pw.val() != confirmPw.val()) {
        confirmPw.get(0).setCustomValidity("InValid");
        return false;
    }
    confirmPw.get(0).setCustomValidity("");

    return true;
};

$(document).ready(async function () {
    execute();
});

async function execute(sort) {
    // keep checking password == confirmed password
    $("#signup-confirm-pw").on("keyup", checkPasswordConfimred);

    // keep checking email changed
    $("#signup-email").on("change", () => {
        duplicationChecked = false;

        $(".duplicate-btn").text("check");
        $(".duplicate-btn").css("color", "#1c8ae5");
        $(".duplicate-btn").css("cursor", "pointer");
    });

    // check duplication of email
    $(".duplicate-btn").click(async () => {
        const email = $(".signup-input").val();
        const duplicate = await checkDuplication(email);

        if (duplicate) {
            $(".duplicate-btn").text("another email");
            $(".duplicate-btn").css("color", "red");
        } else {
            $(".duplicate-btn").text("checked!");
            $(".duplicate-btn").css("color", "green");
            $(".duplicate-btn").css("cursor", "auto");
            duplicationChecked = true;
        }
    });

    // signup button is clicked!
    $(".signup-form").submit((event) => {
        event.preventDefault();

        const form = $(".signup-form").get(0);

        if (
            !form.checkValidity() ||
            !checkPasswordConfimred() ||
            !duplicationChecked
        ) {
            form.classList.add("was-validated");
            return;
        }

        const email = $("#signup-email").val();
        const name = $("#signup-name").val();
        const password = $("#signup-pw").val();

        const navigate = () => {
            location.href = "../page/index.html";
        };

        signup(email, name, password, navigate);
    });
}
