
$.ajax({
    url: "https://ajpage.janjapanweb.com/ajax_quran.php",
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: {
        action: "names",
        language_id: 1
    },
    success: function (data) {
        document.getElementById("sura_names").innerHTML = data;
//console.log(data);
        select_surah();

    }
});




function select_surah(event) {

    try {
        var sn = $(event.target).val();
    } catch (e)
    {
        //first load
        var sn = 1;
    }


    if (localStorage.language)
    {
        db = JSON.parse(localStorage.language);
    } else {
        db = [1];
    }

    if (localStorage.izohlar != "true")
    {
        var data = {
            action: "izohsiz",
            surah_id: sn,
            database_id: db
        };
    } else {
        var data = {
            action: "surah",
            surah_id: sn,
            database_id: db
        };
    }

    ajax(data);
    $("#sura_title").text(sn + " - " + $("#sura_names")[0][$("#sura_names").val() - 1].innerText);
}


function ajax(d)
{
    $.ajax({
        url: "https://ajpage.janjapanweb.com/ajax_quran.php",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: d,
        success: function (data) {
            document.getElementById("main_table").getElementsByTagName("tbody")[0].innerHTML = data;
            addListeners();
        }
    });
}

var btn = document.getElementById("surah_button");
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');

btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        $(".modal").hide();
    }
}
function setting_modal()
{
    document.getElementById("settings_modal").style.display = "block";
}
function close_modals()
{
    $(".modal").hide();
}
function izohlar(event)
{
    localStorage.izohlar = event.target.checked;
}

function set_languages(event)
{
    var ar = [];
    $(".lang").each(function () {
        if (this.checked == true)
        {
            ar.push(this.getAttribute("db_id"));
        }
        localStorage.language = JSON.stringify(ar);
    });
}

window.onload = function ()
{
    if (localStorage.izohlar === "true")
    {
        $("#izohlar").prop("checked", true);
        $(".qavs_ichi").hide();
    }

try{
    languages = JSON.parse(localStorage.language);
}
catch(e)
{
    localStorage.language = [120];
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
function addListeners()
{
    $(".glyphicon-chevron-down").each(function () {
        this.setAttribute("onclick", "down_click(event)");
    });
}
function down_click(event) {
    event.target.parentElement.getElementsByClassName("qavs_ichi")[0].style = "display: inline";
    event.target.classList.remove("glyphicon-chevron-down");
    event.target.classList.add("glyphicon-chevron-up");
    event.target.parentElement.getElementsByClassName("qavs_ichi")[0].setAttribute("onclick", "up_click(event)");
}
function up_click(event) {
    event.target.style = "display: none";
    event.target.parentElement.getElementsByClassName("glyphicon")[0].classList.remove("glyphicon-chevron-up");
    event.target.parentElement.getElementsByClassName("glyphicon")[0].classList.add("glyphicon-chevron-down");
    event.target.parentElement.getElementsByClassName("glyphicon")[0].setAttribute("onclick", "down_click(event)");
    event.target.removeAttribute("onclick");
}