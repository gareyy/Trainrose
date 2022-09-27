async function main() {
    let pyodide = await loadPyodide({ indexURL : 'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/' });
    await pyodide.loadPackage(['pandas', 'micropip']);
    window.pyodide = pyodide;
    await pyodide.runPythonAsync(`
        import pandas as pd
        import micropip
        import js
        import json 
        import pyodide
        await micropip.install('plotly==5.0.0')
        import plotly
        import plotly.express as px
        import warnings
        warnings.simplefilter(action='ignore', category=FutureWarning)

        df = pd.read_csv(pyodide.http.open_url("./EditedDatasets/finalDataset2.csv"))
        cardinals = pd.read_csv(pyodide.http.open_url("./EditedDatasets/cardinals.csv"))

        def display(df, which):
            join = pd.DataFrame()

            station = js.document.querySelectorAll(".stationinput")[which-1].placeholder
            fromMonth = js.document.querySelectorAll(".monthinput")[which*2-2].placeholder
            toMonth = js.document.querySelectorAll(".monthinput")[which*2-1].placeholder
            
            df = df[df["month"]>=fromMonth]
            df = df[df["month"]<=toMonth]
            df = df[df["origin_stop"]==station]
     
            for i in range((which-1)*5, which*5):
                button = js.document.querySelectorAll(".button")[i]
                if (button.className == "button"):
                    df = df[df["time"]!=button.innerHTML]
                    print (button.innerHTML)
    
            df = df.drop(columns=["month", "time"])
            for direction in df["direction"].unique():
                temp = df[df["direction"]==direction]
                temp = temp.groupby(["distance"], as_index=False).sum()
                temp = temp.sort_values(by=["distance"])
                firstDistance = temp["distance"].iat[0]
                temp["distance"] = temp["distance"] - temp["distance"].shift(1)
                temp["distance"].iat[0] = firstDistance
                temp["quantity"] = temp.loc[::-1, "quantity"].cumsum()[::-1]
                temp["direction"] = direction
                join = pd.concat([join, temp])

            finaldf = pd.concat([cardinals, join])

            fig = px.bar_polar(finaldf, r="distance", theta="direction", color="quantity", template="plotly_dark", color_discrete_sequence = px.colors.sequential.Plasma_r)

            graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
            js.plot(graphJSON, f"chart{which}")

        display(df, 1)
        display(df, 2)
    `);
    (document.querySelectorAll(".plot-container"))[0].classList.add("fixed");
    (document.querySelectorAll(".plot-container"))[1].classList.add("fixed");

    createMouseDownListener();
    createKeyDownListener();

    document.querySelector(".splash").style.zIndex = -6;
    document.querySelector(".splash").style.marginLeft= "4000px";
}

function plot(graph, chart) {
    var figure = JSON.parse(graph)
    Plotly.newPlot(chart, figure, {});
}

main();

const stationNames = ["Albion station", "Alderley station", "Altandi station", "Ascot station", "Auchenflower station", "Bald Hills station", "Banoon station", "Banyo station", "Beenleigh station", "Beerburrum station", "Beerwah station", "Bethania station", "Bindha station", "Birkdale station", "Boondall station", "Booval station", "Bowen Hills station", "Bray Park station", "Bundamba station", "Buranda station", "Burpengary station", "Caboolture station", "Cannon Hill station", "Carseldine station", "Central station", "Chelmer station", "Clayfield station", "Cleveland station", "Coomera station", "Coopers Plains station", "Cooran station", "Cooroy station", "Coorparoo station", "Corinda station", "Dakabin station", "Darra station", "Deagon station", "Dinmore station", "Domestic Airport station", "Doomben station", "Dutton Park station", "Eagle Junction station", "East Ipswich station", "Ebbw Vale station", "Edens Landing station", "Elimbah station", "Enoggera station", "Eudlo station", "Eumundi station", "Exhibition station", "Fairfield station", "Ferny Grove station", "Fortitude Valley station", "Fruitgrove station", "Gailes station", "Gaythorne station", "Geebung station", "Glass House Mountains station", "Goodna station", "Graceville station", "Grovely station", "Gympie North station", "Helensvale station", "Hemmant station", "Hendra station", "Holmview station", "Indooroopilly station", "International Airport station", "Ipswich station", "Kallangur station", "Karrabin station", "Keperra station", "Kingston station", "Kippa-Ring station", "Kuraby station", "Landsborough station", "Lawnton station", "Lindum station", "Loganlea station", "Lota station", "Mango Hill East station", "Mango Hill station", "Manly station", "Milton station", "Mitchelton station", "Mooloolah station", "Moorooka station", "Morayfield station", "Morningside station", "Murarrie station", "Murrumba Downs station", "Nambour station", "Narangba station", "Nerang station", "Newmarket station", "Norman Park station", "North Boondall station", "Northgate station", "Nudgee station", "Nundah station", "Ormeau station", "Ormiston station", "Oxford Park station", "Oxley station", "Palmwoods station", "Park Road station", "Petrie station", "Pomona station", "Redbank station", "Richlands station", "Riverview station", "Robina station", "Rocklea station", "Roma Street station", "Rosewood station", "Rothwell station", "Runcorn station", "Salisbury station", "Sandgate station", "Sherwood station", "Shorncliffe station", "South Bank station", "South Brisbane station", "Springfield Central station", "Springfield station", "Strathpine station", "Sunnybank station", "Sunshine station", "Taringa station", "Thagoona station", "Thomas Street station", "Thorneside station", "Toombul station", "Toowong station", "Traveston station", "Trinder Park station", "Varsity Lakes station", "Virginia station", "Wacol station", "Walloon station", "Wellington Point station", "Wilston station", "Windsor station", "Woodridge station", "Wooloowin station", "Woombye station", "Wulkuraka station", "Wynnum Central station", "Wynnum North station", "Wynnum station", "Yandina station", "Yeerongpilly station", "Yeronga station", "Zillmere station"]

const months = ["2022-07", "2022-06", "2022-05", "2022-04", "2022-03", "2022-02", "2022-01", "2021-12", "2021-11", "2021-10", "2021-09", "2021-08", "2021-07", "2021-06", "2021-05", "2021-04", "2021-03", "2021-02", "2021-01", "2020-12", "2020-11", "2020-10", "2020-09", "2020-08", "2020-07", "2020-06", "2020-05", "2020-04", "2020-03", "2020-02", "2020-01", "2019-12", "2019-11", "2019-10", "2019-09", "2019-08", "2019-07", "2019-06", "2019-05", "2019-04", "2019-03", "2019-02", "2019-01", "2018-12", "2018-11", "2018-10", "2018-09", "2018-08", "2018-07", "2018-06", "2018-05", "2018-04", "2018-03", "2018-02", "2018-01", "2017-12", "2017-11", "2017-10", "2017-09", "2017-08", "2017-07", "2017-06", "2017-05", "2017-04", "2017-03", "2017-02", "2017-01", "2016-12", "2016-11", "2016-10"]

var activeDropdown = null;

var placeholder = "Beerburrum station";

var focusing = false;
var focusId;

var prevId;


function mouseDown(element) {
    let className = element.target.className;
    
    if (focusing) {
    	if (activeDropdown != null) {
      	    activeDropdown.innerHTML = "";
    		activeDropdown.style = "";
        }
        if (element.target.id != prevId) {
            input.placeholder = placeholder;
            input.value = "";
        }
    }
    if (className == "box" || className == "stationinput" || className == "monthinput from" || className == "monthinput to" || className == "downarrow") {
    	focusing = true;
        prevId = element.target.id;
    	input = document.querySelector(`#${element.target.id}`).firstElementChild;
        window.setTimeout(() => input.focus(), 10);
        placeholder = input.placeholder;
        input.placeholder = "";
        activeDropdown = document.querySelector(`#${element.target.id}`).parentElement.lastElementChild;
        if (input.className == "stationinput") {
            if (input.value == "") {
                displayAllStations();
            } else {
                displaySelectStations(input.value);
                if (activeDropdown.innerHTML == "") {
                    activeDropdown.style.borderBottom = "";
                } else {
                    activeDropdown.style.borderBottom = "1px solid #506784";
                }
            }
        } else if (input.className == "monthinput from") {    
            displayMonthsFrom(document.querySelector(`#${element.target.id}`).parentElement.parentElement.lastElementChild.firstElementChild.firstElementChild.placeholder);
        } else if (input.className == "monthinput to") {
            //console.log(document.querySelector(`#${element.target.id}`).parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.placeholder);
            displayMonthsTo(document.querySelector(`#${element.target.id}`).parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.placeholder);
        }
        activeDropdown.style.borderBottom = "1px solid #506784";
    } else if (className == "station") {
    	placeholder = element.target.id;
        input.value = "";
        input.placeholder = placeholder;
        console.log(prevId);
        if (prevId == "one" || prevId == "three" || prevId == "four") {
            pyodide.runPython(`
                display(df, 1)
            `);
        } else {
            pyodide.runPython(`
                display(df, 2)
            `);
        }
        
    } else if (className == "button" || className == "button on") {
        if (className == "button on") {
            console.log("blue");
            element.target.style.color = "#506784";
        } else {
            element.target.style.color = "#AAAAAA";
        }
        element.target.classList.toggle("on");
        if (element.target.id == "seven") {
            pyodide.runPython(`
                display(df, 1)
            `);
        } else {
            pyodide.runPython(`
                display(df, 2)
            `);
        }
    }
}

function displayAllStations () {
	var string = ""
    for (var i = 0; i < stationNames.length; i++) {
        string = string.concat(`<div id="${stationNames[i]}" class="station">${stationNames[i]}</div>`)
    }
    activeDropdown.innerHTML = string;
}

function displayMonthsFrom (to) {
	// get index of to in months
    var index = months.indexOf(to)+1;
    var string = ""
    for (var i=index; i < months.length; i++) {
        string = string.concat(`<div id="${months[i]}" class="station">${months[i]}</div>`)
    }
    activeDropdown.innerHTML = string;
}

function displaySelectMonthsFrom (to, query) {
	// get index of to in months
    var index2 = months.indexOf(to)+1;
    var string = ""
    for (var i=index2; i < months.length; i++) {
        var index = months[i].toUpperCase().indexOf(query.toUpperCase());
        if (index > -1) {
            string = string.concat(`<div id="${months[i]}" class="station">${months[i].slice(0, index)}<b>${months[i].slice(index, index+query.length)}</b>${months[i].slice(index+query.length, months[i].length)}</div>`)
        }
    }
    activeDropdown.innerHTML = string;
}

function displayMonthsTo (from) {
	// get index of to in months
    var index = months.indexOf(from);
    var string = ""
    for (var i=0; i < index; i++) {
        string = string.concat(`<div id="${months[i]}" class="station">${months[i]}</div>`)
    }
    activeDropdown.innerHTML = string;
}

function displaySelectMonthsTo (from, query) {
	// get index of to in months
    var index2 = months.indexOf(from);
    var string = ""
    for (var i=0; i < index2; i++) {
        var index = months[i].toUpperCase().indexOf(query.toUpperCase());
        if (index > -1) {
            string = string.concat(`<div id="${months[i]}" class="station">${months[i].slice(0, index)}<b>${months[i].slice(index, index+query.length)}</b>${months[i].slice(index+query.length, months[i].length)}</div>`)
        }
    }
    activeDropdown.innerHTML = string;
}


function displaySelectStations (query) {
	var string = ""
    for (var i = 0; i < stationNames.length; i++) {
        var index = stationNames[i].toUpperCase().indexOf(query.toUpperCase());
        if (index > -1) {
            string = string.concat(`<div id="${stationNames[i]}" class="station">${stationNames[i].slice(0, index)}<b>${stationNames[i].slice(index, index+query.length)}</b>${stationNames[i].slice(index+query.length, stationNames[i].length)}</div>`)
        }
    }
    activeDropdown.innerHTML = string;
}

function keyDown(event) {
	var activeElement = document.activeElement;
    if (event.keyCode === 13 && activeElement.value != undefined) {
        placeholder = activeElement.parentElement.parentElement.lastElementChild.firstElementChild.id;
        activeDropdown.innerHTML = "";
        activeDropdown.style = "";
        activeElement.blur();
        activeElement.value = "";
        activeElement.placeholder = placeholder;
        if (prevId == "one" || prevId == "three" || prevId == "four") {
            pyodide.runPython(`
                display(df, 1)
            `);
        } else {
            pyodide.runPython(`
                display(df, 2)
            `);
        }
    } else {
        if (activeElement.className == "stationinput") {
            window.setTimeout(() => {
                if (activeElement.value.length == 0) {
                    displayAllStations();
                } else {
                    displaySelectStations(activeElement.value);
                    if (activeDropdown.innerHTML == "") {
                        activeDropdown.style.borderBottom = "";
                    } else {
                        activeDropdown.style.borderBottom = "1px solid #506784";
                    }
                }
            }, 10);
        } else if (activeElement.className == "monthinput from") {
            window.setTimeout(() => {
                if (activeElement.value.length == 0) {
                    displayMonthsFrom(document.querySelector(`#${activeElement.id}`).parentElement.parentElement.lastElementChild.firstElementChild.firstElementChild.placeholder);
                } else {
                    displaySelectMonthsFrom(document.querySelector(`#${activeElement.id}`).parentElement.parentElement.lastElementChild.firstElementChild.firstElementChild.placeholder, activeElement.value);
                    if (activeDropdown.innerHTML == "") {
                        activeDropdown.style.borderBottom = "";
                    } else {
                        activeDropdown.style.borderBottom = "1px solid #506784";
                    }
                }
            }, 10);
        } else if (activeElement.className == "monthinput to") {
            window.setTimeout(() => {
                if (activeElement.value.length == 0) {
                    displayMonthsTo(document.querySelector(`#${activeElement.id}`).parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.placeholder, activeElement.value);
                } else {
                    displaySelectMonthsTo(document.querySelector(`#${activeElement.id}`).parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.placeholder, activeElement.value);
                    if (activeDropdown.innerHTML == "") {
                        activeDropdown.style.borderBottom = "";
                    } else {
                        activeDropdown.style.borderBottom = "1px solid #506784";
                    }
                }
            }, 10);
        }
    }
}

function createMouseDownListener() {
    document.addEventListener("mousedown", (element) => {
        if (element.button == 0) { 
            mouseDown(element);
        }
    });
}

function createKeyDownListener() {
	document.addEventListener("keydown", (event) => {
		keyDown(event);
    });
}