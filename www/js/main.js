/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var language_id = 1;
var languages = Boolean(localStorage.language) ? JSON.parse(localStorage.language) : [120];
var language = Boolean(localStorage.menu_language) ? localStorage.menu_language : "uzbek";
var selected_surah = 1;
var selected_title;
var ayah_tracker = Boolean(localStorage.ayah_tracker) ? localStorage.ayah_tracker : {};

var lang = {
    english: {
        home_title: "Surah List",
        settings: "Settings",
        about: "About",
        main_page: "Select a Surah",
        settings_page: "Settings",
        menu_language: "Menu Language",
        text_settings: "Text Settings",
        comments: "Comments",
        about_page: "From the Author",
        surah_title: "Surah: ",
        loading: "Loading...",
        toast_disabled: "Option disabled",
        close_app: "Do you want to close the app?",
        close_app_title:"Exit App",
        close_app_buttons:["Yes","No"],
        greeting: "Assalaamu alaykum",
        gr_text: "Dear brothers and sisters, I have tried to make the application easy to use as much as I could and I am continually working on improving it. <br>My goal is to bring high quality products to spread the truth. <br> Your support in any form is highly appreciated and will surely be rewarded accordingly by Allah Almighty. <br> Please, share and purchase to support the cause."
    },
    uzbek: {
        home_title: "Suralar",
        settings: "Sozlamalar",
        about: "Muallifdan",
        main_page: "Surani Tanlang",
        settings_page: "Dastur Sozlamalari",
        menu_language: "Menyu Tili",
        text_settings: "Matn Sozlamalari",
        comments: "Izohlar",
        about_page: "Muallifdan",
        surah_title: "Sura: ",
        loading: "Yuklash...",
        toast_disabled: "Vaqtinchalik o`chirilgan",
        close_app: "Dasturdan chiqmoqchimisiz?",
        close_app_title:"Chiqish",
        close_app_buttons:["Ha","Yo`q"],
        greeting: "Assalomu alaykum",
        gr_text: "Qadrli muxlislar, men bu dasturni sizga foydalanish qulay bo`lishi uchun baholi qudrat harakat qildim va bunda davom etmoqdaman. Maqsadimiz yuqori sifatli dasturlar taklif qilish va haqiqatni shu yo`l bilan yetkazish. <br> Sababimizni qo`lingizdan kelganicha qo`llab quvvatlang va tanishlaringizga ham ulashing. <br> Olloh Taolo sizdan va bizdan har bir xayrli amalimizni qabul qilsin."
    },
    russian: {
        home_title: "Суры",
        settings: "Установки",
        about: "О программе",
        main_page: "Выберите Суру",
        settings_page: "Установки",
        menu_language: "Язык меню",
        text_settings: "Текстовые установки",
        comments: "Комментарии",
        about_page: "От Автора",
        surah_title: "Сура: ",
        loading: "Загрузка...",
        toast_disabled: "Опция отключена",
        close_app: "Вы хотите закрыть приложение?",
        close_app_title:"Выход",
        close_app_buttons:["Да","нет"],
        greeting: "Ассаляму аляйкум",
        gr_text: "Дорогие братья и сестры, я постарался чтобы эта программа стала наиболее удобна в пользовании и все еще продолжаю работу. <br>Моя цель расспространить верный путь посредством своей работы. <br>Аллах Субханаху ва Таала вознаградит каждого за вклад обязательно. Присоединитесь же своим.<br>Пожалуйста поделитесь с друзьями и приобретайте, чтобы я мог дальше, лучше и больше писать."
    }
};

ons.ready(function () {
    console.log("Onsen UI is ready!");


    if (Boolean(localStorage.language))
    {
        language = localStorage.menu_language;
    } else {

        localStorage.menu_language = language;
    }
});

window.fn = {};
window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};
window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content
            .load(page)
            .then(menu.close.bind(menu));
};

document.addEventListener('show', function (event) {
    var page = event.target;
    console.log(page.id); // can detect which page
    //
    //resetDate();
    addListeners();
    switch (page.id)
    {
        case "titles":
            console.log("surah title list");
            get_surah_names();
            //show only once
            if (!Boolean(localStorage.first_open))
            {
                ons.notification.alert({
                    message: 'Endi suralar birinchi marta o`qishdayoq offline bo`lib qoladi. <br>Qayta o`qish uchun traffik talab qilinmaydi.',
                    // or messageHTML: '<div>Message in HTML</div>',
                    title: 'Xushxabar!',
                    buttonLabel: 'OK',
                    animation: 'default', // or 'none'
                    // modifier: 'optional-modifier'
                    callback: function () {
                        // Alert button is closed!
                        localStorage.first_open = "done";
                    }
                });
            }
            
            break;
        case "surah_text":
            console.log("surah text");
            select_surah();
            //showBannerFunc();
            window.plugins.AdMob.destroyBannerView();
            break;
        case "settings":
            set_settings();
            showBannerFunc();
            break;
        case "about":
            set_about_page();
            showBannerFunc();
            break;
    }
});

function set_about_page() {

    document.querySelector("#muallifdantitle").innerHTML = lang[language].about_page;
    document.querySelector("#greetingtitle").innerHTML = lang[language].greeting;
    document.querySelector("#greetingtext").innerHTML = lang[language].gr_text;

}

function set_settings()
{
    document.querySelector("#appsettingstitle").innerHTML = lang[language].settings_page;
    document.querySelector("#menulangtitle").innerHTML = lang[language].menu_language;
    document.querySelector("#textsettitle").innerHTML = lang[language].text_settings;
    document.querySelector("#izohlartitle").innerHTML = lang[language].comments;

    document.querySelector("ons-list-item[lang-id='" + language + "']").querySelector("ons-radio").checked = true;

    if (localStorage.izohlar === "true")
    {
        $("#izoh").prop("checked", true);
        //$(".qavs_ichi").hide();
    }

    try {
        languages = JSON.parse(localStorage.language);
    } catch (e)
    {
        localStorage.language = JSON.stringify([120]);
        languages = JSON.parse(localStorage.language);
    }

    menuitems = $(".lang");
    for (i = 0; i < languages.length; i++)
    {
        for (k = 0; k < menuitems.length; k++)
        {
            if (menuitems[k].getAttribute("db_id") == languages[i])
            {
                menuitems[k].checked = true;
            }
        }
    }
}





function select_surah(event) {

    if (localStorage.izohlar != "true")
    {
        izoh_data = {action: "izohsiz_text_obj", surah_id: selected_surah, database_id: languages};
    } else {
        izoh_data = {action: "surah_text_obj", surah_id: selected_surah, database_id: languages};
    }

    if (check_store(selected_surah)) {
        get_by_suraid();
    } else {
        ajax(izoh_data);
    }
    $("#sura_title").text(selected_surah + ", " + selected_title);
}

function izohlar(event)
{
    localStorage.izohlar = event.target.checked;
}

function ajax(d)
{
    $.ajax({
        url: "https://ajpage.janjapanweb.com/ajax_quran.php",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: d,
        beforeSend: function (xhr) {
            document.querySelector("#loadingtitle").innerHTML = lang[language].loading;
            document.querySelector('#loading_circle').show();
        },
        success: function (data) {
            document.querySelector('#loading_circle').hide();
            if (data.indexOf("title") > 0)
            {
                var data = JSON.parse(data);
                //display_surah_names(data);
                for (i in data)
                {
                    data[i] = JSON.parse(data[i])
                }
                input_title_data(data);

            } else if (data.indexOf("VerseID") >= 0)
            {
                var data = JSON.parse(data);
                for (i in data)
                {
                    data[i] = JSON.parse(data[i])
                }
                show_surah_content(data);

            }

        }
    });
}

function addListeners()
{
    try {
        document.querySelector("#surahlisttitle").innerHTML = lang[language].home_title;
        document.querySelector("#settingstitle").innerHTML = lang[language].settings;
        document.querySelector("#abouttitle").innerHTML = lang[language].about;
    } catch (e)
    {
        language = "english";
        document.querySelector("#surahlisttitle").innerHTML = lang[language].home_title;
        document.querySelector("#settingstitle").innerHTML = lang[language].settings;
        document.querySelector("#abouttitle").innerHTML = lang[language].about;
    }

    document.addEventListener("deviceready", function () {
        window.FirebasePlugin.getToken(function (token) {
            // save this server-side and use it to push notifications to this device
            console.log("Device ready token", token);
        }, function (error) {
            console.error(error);
        });

        // Get notified when a token is refreshed
        window.FirebasePlugin.onTokenRefresh(function (token) {
            // save this server-side and use it to push notifications to this device
            console.log("Refresh to get new token: " + token);
        }, function (error) {
            alert(error);
        });

        // Get notified when the user opens a notification
        window.FirebasePlugin.onNotificationOpen(function (notification) {
            console.log(JSON.stringify(notification));
            ons.notification.alert(notification.body);
        }, function (error) {
            console.error(error);
        });
        initAd();
        registerAdEvents();
        
    }, false);

    ons.setDefaultDeviceBackButtonListener(function (event) {
        ons.notification.confirm({
            message: lang[language].close_app,
            title: lang[language].close_app_title,
            buttonLabels: lang[language].close_app_buttons,
            animation: 'default', // or 'none'
            primaryButtonIndex: 1,
            cancelable: true,
            callback: function (index) {
                // -1: Cancel
                // 0-: Button index from the left
                console.log(index, "index");
                if (index == 0) { // OK button                    
                        navigator.app.exitApp(); // Close the app
                    }
            }
        });

    for (i in languages)
    {
        languages[i] = JSON.parse(languages[i]);
    }
});

}

function set_langauge()
{
    if (event.currentTarget.querySelector("ons-radio").disabled)
    {
        ons.notification.toast(lang[language].toast_disabled, {timeout: 500, animation: "fall"});
    } else {
        language = event.currentTarget.getAttribute("lang-id");
        localStorage.menu_language = language;
    }
}

function display_surah_names(data)
{
    document.querySelector("#selectsurahtitle").innerHTML = lang[language].home_title;
    for (i in data)
    {
        //data[i] = JSON.parse(data[i]);
        //console.log(data[i]["languageNo"]);
        if (data[i]["languageNo"] == 1)
        {
            var oli = document.createElement("ons-list-item");
            oli.setAttribute("tappable", "true");
            oli.setAttribute("id", "sura-" + data[i].chapterId);
            oli.setAttribute("title", data[i].title);
            oli.setAttribute("surahNo", data[i].chapterId);
            oli.setAttribute("onmouseup", "show_surah(event)");
            oli.innerHTML = `<div class="left"><ons-row><ons-col><span class="ayah_id"> ${data[i].chapterId} </span></ons-col></ons-row></div><div class="center arabic"><ons-row><ons-col>${data[i].title }</ons-col></ons-row></div>`;
        } else if (data[i]["languageNo"] != 1 && data[i].title != undefined) {
            oli.innerHTML += "<ons-row><ons-col>" + data[i].title + "</ons-col></ons-row>";
            document.getElementById("main_table").appendChild(oli);
        }
    }
    location.hash = "sura-" + (Number(selected_surah) - 1);
    showInterstitialFunc();
    window.plugins.AdMob.destroyBannerView();
}

function show_surah()
{
    selected_surah = event.currentTarget.getAttribute("surahno");
    selected_title = event.currentTarget.getAttribute("title");
    console.log(selected_surah, "selected_surah");
    fn.load("surah.html");
}


function set_languages(event)
{
    var ar = [];
    $(".lang").each(function () {
        if (this.checked)
        {
            console.log(event.target);
            ar.push(this.getAttribute("db_id"));
        }
        localStorage.language = JSON.stringify(ar);
        languages = ar;

        for (i in languages)
        {
            languages[i] = JSON.parse(languages[i])
        }
    });
}

//initialize the goodies
function initAd(){
        if ( window.plugins && window.plugins.AdMob ) {
            var ad_units = {
                ios : {
                    banner: 'ca-app-pub-3838820812386239/2551267023',		//PUT ADMOB ADCODE HERE
                    interstitial: 'ca-app-pub-3838820812386239/2551267023'	//PUT ADMOB ADCODE HERE
                },
                android : {
                    banner: 'ca-app-pub-3838820812386239/6533462802',		//PUT ADMOB ADCODE HERE
                    interstitial: 'ca-app-pub-3838820812386239/2551267023'	//PUT ADMOB ADCODE HERE
                }
            };
            var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
 
            window.plugins.AdMob.setOptions( {
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
                bannerAtTop: true, // set to true, to put banner at top
                overlap: true, // banner will overlap webview
                offsetTopBar: false, // set to true to avoid ios7 status bar overlap
                isTesting: false, // receiving test ad
                autoShow: true // auto show interstitial ad when loaded
            });
 
            registerAdEvents();
        } else {
            //alert( 'admob plugin not ready' );
        }
}
//functions to allow you to know when ads are shown, etc.
function registerAdEvents() {
        document.addEventListener('onReceiveAd', function(){});
        document.addEventListener('onFailedToReceiveAd', function(data){});
        document.addEventListener('onPresentAd', function(){});
        document.addEventListener('onDismissAd', function(){ });
        document.addEventListener('onLeaveToAd', function(){ });
        document.addEventListener('onReceiveInterstitialAd', function(){ });
        document.addEventListener('onPresentInterstitialAd', function(){ });
        document.addEventListener('onDismissInterstitialAd', function(){ });
    }
 //display the banner
function showBannerFunc(){
    window.plugins.AdMob.createBannerView();
}

//display the interstitial
function showInterstitialFunc(){
    window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown and show when it's loaded.
    window.plugins.AdMob.requestInterstitialAd();
}