// Three buttons used in the program
document.getElementById("upload-button").addEventListener('click', fileUpload);
var download_button = document.getElementById("download-button");
download_button.addEventListener('click', fileDownload);
var plus_button = document.getElementById("plus-button");
plus_button.addEventListener('click', addResolution);

var table=document.getElementById("text");

var info;

const resolutions = [];
const counts = [];
const units = [];

var textFile = null;

// Submit button
document.getElementById("submit").addEventListener('click', submitResolution);

// Click functions for the buttons
function fileUpload(event) {
    document.getElementById("file-upload").addEventListener("change", getFile);
    document.getElementById("file-upload").click();
}

function getFile(event) {
	const input = event.target
  if ('files' in input && input.files.length > 0) {
	  placeFileContent(
      document.getElementById('test'),
      input.files[0])
  }
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	target.value = content; info = content; updateToComp();
    }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

function fileDownload() {
    document.getElementById("file-download").click();
}

function addResolution() {
    var list = document.getElementById("list");
    if(list.style.display == "none") {
        list.style.display = "block";
        plus_button.value = "-";
    } else {
        list.style.display = "none";
        plus_button.value = "+";
    }
}

// Submit button functinoality

function submitResolution() {
    var resolution = document.getElementById("resolution").value;
    var count = document.getElementById("count").value;
    var unit = document.getElementById("unit").value;
    resolutions.push(resolution);
    counts.push(count);
    units.push(unit);
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    row.addEventListener('click', allowEdits);
    row.myParam = row;

    cell1.innerHTML = resolution;
    cell2.innerHTML = count;
    cell3.innerHTML = unit;

    updateToFile();
}

function allowEdits(evt) {
    var currCount = evt.currentTarget.cells[1].innerHTML;
    let newCount = prompt("Please enter the updated count. Previous = " + currCount);
    evt.currentTarget.cells[1].innerHTML = newCount;
    var indexToChange = 0;
    for(let i = 0; i < resolutions.length; i++) {
        if(resolutions[i] === evt.currentTarget.cells[0].innerHTML) {
            indexToChange = i;
            break;
        }
    }
    counts[indexToChange] = newCount;
    updateToFile();
}

function updateToFile() {
    var total = [];
    for(let i = 0; i < resolutions.length; i++) {
        total.push(resolutions[i]);
        total.push(counts[i]);
        total.push(units[i]);
    }
    var data = new Blob([total], {type: 'text/plain'});

    if(textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    document.getElementById("file-download").href = textFile;
    document.getElementById("file-download").download = textFile;
}

function updateToComp() {
    const arr = info.split(',');
    var currRow;
    for(let i = 0; i < arr.length; i++) {
        if(i%3 == 0) {
            currRow = table.insertRow(table.rows.length);
            currRow.addEventListener('click', allowEdits);
            currRow.insertCell(0).innerHTML = arr[i];
            resolutions.push(arr[i]);
        } else if(i % 3 == 1) {
            currRow.insertCell(1).innerHTML = arr[i];
            counts.push(arr[i]);
        } else {
            currRow.insertCell(2).innerHTML = arr[i];
            units.push(arr[i]);
        }
    }
}