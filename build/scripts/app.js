/*global webshim $ wl MobileDetect*/

$(function () {

    function addStartClass(el, className) {
        $(el).addClass(className);
    }

    if (!window.matchMedia("(max-width:768px)").matches) {
        addStartClass(".icon-lines", "icon-lines_hide");
        addStartClass(".sec__decor", "sec__decor_hide");

        $('.icon-lines').viewportChecker({
            classToRemove: 'icon-lines_hide'
        });

        $('.sec__decor').viewportChecker({
            classToRemove: 'sec__decor_hide'
        });
    }

    var body = $("body");
    var thanksLocation = "thanks.html";
    var wlLand = false;
    var name;

    if ($('input[type="range"]').length) {
        $('input[type="range"]').rangeslider({
            polyfill: false
        });
    }

    webshim.setOptions('forms', {
        lazyCustomMessages: true,
        replaceValidationUI: true
    });
    webshim.polyfill('forms');

    function phoneLink() {
        var md = new MobileDetect(window.navigator.userAgent);
        var phoneLink = $("[data-phone]");

        if (md.mobile()) {
            phoneLink.attr("href", "tel:" + $(".phone-link").data("phone"));
            phoneLink.removeClass("js-small-btn");
        } else {
            phoneLink.attr("href", "");
            phoneLink.addClass("js-small-btn");
        }
    }
    phoneLink();

    // form handler

    $("input[name=phone]").inputmask({
        "mask": "+9(999)999-9999",
        greedy: false,
        clearIncomplete: true,
        "oncomplete": function () {
            $(this).addClass("input_success");
        },
        onKeyDown: function (event, buffer, caretPos, opts) {

            if (buffer[buffer.length - 1] === "_") {
                $(this).removeClass("input_success");
            } else {
                $(this).addClass("input_success");
            }
        }

    });

    body.on("click", ".js-small-btn", function (e) {
        e.preventDefault();

        if (!$(".thanks").length) {
            $("html").addClass("form-open");
            $(".form-wrap_small").addClass("form-wrap_open");
        }
    });

    body.on("click", function (e) {
        var self = $(e.target);

        if (self.hasClass("form-wrap") || self.hasClass("form__close")) {
            $("html").removeClass("form-open");
            $(".form-wrap").removeClass("form-wrap_open");
        }
    });

    if (typeof wl != "undefined") {
        wlLand = true;

        wl.callbacks.onFormSubmit = function ($form, res) {
            if ($form.data('next')) {

                if (res.status == 200) {
                    smallFormHandler($form);
                } else {
                    wl.callbacks.def.onFormSubmit($form, res);
                }
            } else {
                bigFormHandler($form);
            }
        };
    } else {
        wlLand = false;

        $("#smallForm, #bottomForm").submit(function (e) {
            e.preventDefault();
            var self = $(this);

            smallFormHandler(self);
        });

        $("#bigForm").submit(function (e) {
            e.preventDefault();
            var self = $(this);

            bigFormHandler(self);
        });
    }

    function formAction() {
        var smallFormWrap = document.querySelector(".form-wrap_small");
        var bigFormWrap = document.querySelector(".form-wrap_big");

        return {

            openSmallForm: function () {
                document.documentElement.classList.add("form-open");
                smallFormWrap.classList.add("form-wrap_open");
            },

            openBigForm: function () {
                document.documentElement.classList.add("form-open");
                bigFormWrap.classList.add("form-wrap_open");
            },

            closeSmallForm: function () {
                document.documentElement.classList.remove("form-open");
                smallFormWrap.classList.remove("form-wrap_open");
            },

            closeBigForm: function () {
                document.documentElement.classList.remove("form-open");
                bigFormWrap.classList.remove("form-wrap_open");
            }
        };
    }

    function smallFormHandler(form) {

        var selfName = form.find("input[name=name]");
        var selfPhone = form.find("input[name=phone]");
        var selfEmail = form.find("input[name=email]");
        var formData = form.serialize();

        var landUserInfo = {
            "name": selfName.val(),
            "phone": selfPhone.val(),
            "email": selfEmail.val()
        };

        localStorage.setItem("landUserInfo", JSON.stringify(landUserInfo));

        name = selfName.val();

        //if (wlLand === false) {

        $.ajax({
            type: "POST",
            url: "php/send.php",
            data: formData,
            success: function () {
                window.location = thanksLocation;
            }
        });
        // } else {
        //     window.location = thanksLocation;
        // }

        if (name) {
            localStorage.setItem("landclientname", name + ", наши");
        } else {
            localStorage.setItem("landclientname", "Наши");
        }
    }

    function bigFormHandler(form) {
        var userInfo;
        var formData;

        if (localStorage.getItem("landUserInfo")) {
            userInfo = JSON.parse(localStorage.getItem("landUserInfo"));
        }

        $("[name=name1]").val(userInfo.name);
        $("[name=phone1]").val(userInfo.phone);
        $("[name=email1]").val(userInfo.email);

        formData = form.serialize();

        if (wlLand === false) {

            $.ajax({
                type: "POST",
                url: "php/sendpresent.php",
                data: formData,
                success: function () {
                    formAction().closeBigForm();
                }
            });
        }
    }

    function thanksPageHandler() {

        if (isThanksPage()) {
            formAction().openBigForm();
            $("#thanksName").text(localStorage.getItem("landclientname"));
        }

        function isThanksPage() {

            if (document.querySelector(".thanks")) {
                return true;
            } else {
                return false;
            }
        }
    }
    thanksPageHandler();
});
//# sourceMappingURL=app.js.map
