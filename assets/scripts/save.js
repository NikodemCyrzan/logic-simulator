const { ipcRenderer } = require("electron");

let inputData;

ipcRenderer.send("get-data");
ipcRenderer.on("save:data", (event, items) => {
    console.log(items);
    inputData = items;

    document.querySelector("#save").addEventListener('click', event => {
        event.preventDefault();
        const name = document.querySelector('#name').value;
        ipcRenderer.send('save:circuit', name, ["elon melon"])
    });

    document.querySelector("#name").value = inputData;
})