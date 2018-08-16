/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sdb;
var big_data = [];
var databaseName = "suralar";
var izoh_data;
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Some features will not be available.");
} else {
//start
    console.log("sdb initiated");
    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
    };
}


function show_surah_content(data)
{
    sdb.close();
    manage_object_stores(databaseName, selected_surah, data);
    //document.querySelector("#ayah_list").innerHTML = data;
}

function show_surah_content_now()
{
    //load data from 
    var rows = "";
    if (izoh_data.action == "izohsiz_text_obj")
    {
        for (var i = 0; i < big_data.length; i++)
        {
            rows = create_row(rows, i);
        }
    } else if (izoh_data.action == "surah_text_obj")
    {

    }
    //console.log(rows);
    document.querySelector("#ayah_list").innerHTML = rows;
    $("ons-list-item").off().on("click", function () {
                    $(event.currentTarget).find(".qavs_ichi").toggle();
                    $(event.currentTarget).find(".zmdi-comment").toggle();
                });
                rows = "";
                big_data = [];
            }
function create_row(rows, i)
{
    if (big_data[i]['DatabaseID'] == 1)
            {
                rows += `<ons-list-item id="ayah-${big_data[i]['VerseID']}" ><ons-row><ons-col><span class="ayah_id">${big_data[i]['VerseID']}</span></ons-col></ons-row>
             <ons-row><ons-col class="arabic"><span class="ayah_text arabic">${big_data[i]['AyahText']}</span></ons-col></ons-row></ons-list-item>`;
            } else {
                
                    var izohsiz = big_data[i]['AyahText'].replace(/\(/g, '<i class="zmdi zmdi-comment"></i><span class="qavs_ichi">');
                    izohsiz = izohsiz.replace(/\)/g, '</span>');
                    rows += `<ons-list-item tappable><ons-row><ons-col><span class="ayah_id">${big_data[i]['VerseID']}</span></ons-col></ons-row><ons-row><ons-col><span class="ayah_text">${izohsiz}</span></ons-col></ons-row></ons-list-item>`;
                
            }
            return row;
}

function manage_object_stores(databaseName, selected_surah, rd) {

    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
        var version = parseInt(sdb.version);
        //check if the objectStore exists
        console.log("checking the store", sdb);
        if (sdb.objectStoreNames.contains(selected_surah))
        {
            //the selected_surah exists. Call startTransaction            
            console.log("secondRequest");
        } else {
            sdb.close();
            //objectStoreNames does not CONTAIN the selected_surah
            //Create new one
            var secondRequest = indexedDB.open(databaseName, version + 1);
            console.log("manage stores is processing version upgrade", version, secondRequest);
            secondRequest.onupgradeneeded = function (e) {

                sdb = e.target.result;
                try {
                    console.log("upgrading", version + 1);
                    var objectStore = sdb.createObjectStore(selected_surah, {
                        autoIncrement: true
                    });
                    objectStore.createIndex("VerseID", "VerseID", {
                        unique: false
                    });
                    objectStore.createIndex("DatabaseID", "DatabaseID", {
                        unique: false
                    });
                    objectStore.createIndex("SuraID", "SuraID", {
                        unique: false
                    });
                } catch (e) {
                    console.log(e.message);
                }
            };
            secondRequest.onsuccess = function (e) {
                e.target.result.close();
                console.log("new data store created");
                startTransaction(rd);
            };
            secondRequest.onerror = function (e) {
                console.log(e.target.error.message, "store Name failed to create?");
            };
        }

    };
    request.onerror = function (e) {
        console.log(e.type);
    }
}
function startTransaction(rd) {

    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
        //console.log(sdb);
        var transaction = sdb.transaction([selected_surah], "readwrite");
        var lotStore = transaction.objectStore(selected_surah);
        //console.log(lotStore);
        rd.forEach(function (ayah) {
            ////console.log("adding rows " + lot); //JSON.stringify(lot)
            //add more properties here                
            var request = lotStore.put(ayah);
            request.onsuccess = function (e) {
                ////console.log(e.target.result + " " + " is the result id (key)");
            }
            request.oncomplete = function (e) {
            }
        });
        // Do something when all the data is added to the database.
        transaction.oncomplete = function (event) {
            console.log("All done!");
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            //HERE CALL display function
            get_by_suraid();
        };
        transaction.onerror = function (event) {
            // Don't forget to handle errors!
            //console.log("error! " + event.target.error.message);
        };
    };
    request.onerror = function (event) {
        //console.log(event);
    }
}

function get_by_suraid() {

    console.log("get_by_surah");
    if (sdb.objectStoreNames.contains(selected_surah))
    {
//the selected_surah exists. Data also exists?
        console.log(selected_surah, "exists, proceed to data retrieval");
        var store = sdb.transaction(selected_surah, "readonly").objectStore(selected_surah);
        var index = store.index('SuraID');
        keyRange = IDBKeyRange.only(["SuraID"]);
        console.log(index);
        // To use one of the key ranges, pass it in as the first argument of openCursor()/openKeyCursor()
        var request = index.count(keyRange);
        request.onsuccess = function (event) {
            big_data = [];
            var cursor = event.target.result;
            console.log(cursor, "row counts");
            request = index.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    //include only selected languages
                    if (languageID(cursor.value.DatabaseID))
                    {
                        big_data.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    //console.log("loading complete", big_data);
                    show_surah_content_now();
                }
            };
            console.log(cursor, "cursor length");
        };
        request.onerror = function (e)
        {
            console.log(e, "error loading data");
        }

    } else {
        sdb.close();
        console.log("closed sdb, selected_surah does not exist, will CREATE a store now");
    }
}
function languageID(l)
{
    l = Number(l);
    var bul;
    for (var i = 0; i < languages.length; i++)
    {
        //console.log(languages[i], l);
        if (languages[i] === l)
        {
            bul = true;
        }
    }
    return bul;
}
function check_store(selected_surah)
{
    if (sdb.objectStoreNames.contains(selected_surah))
    {
        return true;
    } else {
        return false;
    }
}