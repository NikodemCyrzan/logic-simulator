const { ipcRenderer } = require("electron");

let circuit = new Circuit(1, 1);

let scale = 1;
let gridOn = false;
let gridAdded = false;
const workspaceWidth = () => 2000 * scale;
const workspaceHeight = () => 2000 * scale;

let stage = new Konva.Stage({
    container: 'workspace',
    width: workspaceWidth(),
    height: workspaceHeight()
});

document.getElementById("grid-toggle").addEventListener('click', toggleGrid);
document.getElementById("save").addEventListener('click', () => {
    openSaveWindow();
});

ipcRenderer.on('ask:save', () => {
    openSaveWindow();
})
ipcRenderer.on('ask:grid-toggle', () => {
    toggleGrid();
})
ipcRenderer.on('ask:new', () => {
    toggleGrid();
})

let gridLayer = new Konva.Layer();
let mainLayer = new Konva.Layer();

stage.add(gridLayer);
stage.add(mainLayer);

function createGrid(){
    for (let x = 0; x < workspaceWidth(); x++) {
        if (x % 2 == 0)
            gridLayer.add(new Konva.Line({
                points: [
                    x * 40,
                    0,
                    x * 40,
                    workspaceHeight()
                ],
                stroke: "lightgray",
                strokeWidth: 2
            }));
        else
            gridLayer.add(new Konva.Line({
                points: [
                    x * 40,
                    0,
                    x * 40,
                    workspaceHeight()
                ],
                stroke: "lightgray",
                strokeWidth: 1,
                dash: [10.5, 5, 9, 5, 10.5, 0],
            }));
    }
    
    for (let y = 0; y < workspaceWidth(); y++) {
        if (y % 2 == 0)
            gridLayer.add(new Konva.Line({
                points: [
                    0,
                    y * 40,
                    workspaceWidth(),
                    y * 40
                ],
                stroke: "lightgray",
                strokeWidth: 2
            }));
        else
            gridLayer.add(new Konva.Line({
                points: [
                    0,
                    y * 40,
                    workspaceWidth(),
                    y * 40
                ],
                stroke: "lightgray",
                strokeWidth: 1,
                dash: [10.5, 5, 9, 5, 10.5, 0],
            }));
    }
}

function toggleGrid(){
    if (!gridAdded){
        createGrid()
        gridAdded = true;
    }
    if (gridOn){
        gridLayer.clear();
        document.querySelector("#grid-toggle path").setAttribute("d", "M4.99112 4.83432C4.21007 4.05327 2.94374 4.05327 2.16269 4.83432C1.38164 5.61537 1.38164 6.8817 2.16269 7.66275L4.99994 10.5V42C4.99994 43.6569 6.34309 45 7.99994 45H39.4999L41.8372 47.3373C42.6183 48.1183 43.8846 48.1183 44.6656 47.3373C45.4467 46.5562 45.4467 45.2899 44.6656 44.5088L4.99112 4.83432ZM35.4999 41L32.9999 38.5V41H35.4999ZM27.4999 33L28.9999 34.5V41H20.9999V33H27.4999ZM23.4999 29L20.9999 26.5V29H23.4999ZM15.4999 21L16.9999 22.5V29H8.99994V21H15.4999ZM11.4999 17L8.99994 14.5V17H11.4999ZM16.9999 9V11.3431L20.9999 15.3431V9H28.9999V17H22.6568L26.6568 21H28.9999V23.3431L32.9999 27.3431V21H40.9999V29H34.6568L38.6568 33H40.9999V35.3431L44.9999 39.3431V8C44.9999 6.34315 43.6568 5 41.9999 5H10.6568L14.6568 9H16.9999ZM32.9999 9H40.9999V17H32.9999V9ZM8.99994 33H16.9999V41H8.99994V33Z");
        document.querySelector("#grid-toggle path").setAttribute("fill", "lightgray");
    }
    else{
        gridLayer.draw();
        document.querySelector("#grid-toggle path").setAttribute("d", "M8 5C6.34315 5 5 6.34315 5 8V42C5 43.6569 6.34315 45 8 45H42C43.6569 45 45 43.6569 45 42V8C45 6.34315 43.6569 5 42 5H8ZM29 21H21V29H29V21ZM21 9H29V17H21V9ZM29 33H21V41H29V33ZM9 21H17V29H9V21ZM41 21H33V29H41V21ZM33 9H41V17H33V9ZM17 9H9V17H17V9ZM9 33H17V41H9V33ZM41 33H33V41H41V33Z");
        document.querySelector("#grid-toggle path").setAttribute("fill", "black");
    }

    gridOn = !gridOn;
}

function openSaveWindow(){
    ipcRenderer.send('open:save', "ELON", "")
}

drawObject({inputsCount: 2, outputsCount: 1, color: "#121212", name: "AND"})
drawObject({inputsCount: 1, outputsCount: 1, color: "#121212", name: "NOT"})

function drawObject({x, y, inputsCount, outputsCount, name, color}){
    let width = 1;
    let height = (inputsCount >= outputsCount ? inputsCount : outputsCount) == 0 ? 1 : (inputsCount >= outputsCount ? inputsCount : outputsCount);
    let children = [];

    let shadowRect = new Konva.Rect({
        x: x,
        y: y,
        width: width * 40,
        height: height * 40,
        fill: "#c4c4c4",
        strokeWidth: 1,
        stroke: "#c4c4c4",
        cornerRadius: 4
    });

    let rect = new Konva.Rect({
        x: x,
        y: y,
        width: width * 40,
        height: height * 40,
        fill: color,
        strokeWidth: 3,
        stroke: "black",
        cornerRadius: 4,
        draggable: true
    });

    let nameEl = new Konva.Text({
        text: name,
        fill: "white",
        x: width * 20,
        y: height * 20,
        listening: false
    });
    nameEl.setX(rect.x() + width * 20 - nameEl.width() / 2);
    nameEl.setY(rect.y() + height * 20 - nameEl.height() / 2);
    children.push(nameEl);

    rect.on('dragstart', (e) => {
        if (!gridOn)
            return;
        shadowRect.show();
        shadowRect.moveDown();
        rect.moveToTop();
        nameEl.moveToTop();
    });
    rect.on('dragend', (e) => {
        if (!gridOn){
            rect.position({
                x: rect.x() < 0 ? 0 : ((rect.x() + width * 40) > workspaceWidth() ? (workspaceWidth() - width * 40) : rect.x()),
                y: rect.y() < 0 ? 0 : ((rect.y() + height * 40) > workspaceHeight() ? (workspaceHeight() - height * 40) : rect.y())
            });
            for (let i = 0; i < children.length; i++) {
                children[i].position({
                    x: rect.x() + width * 20 - children[i].width() / 2,
                    y: rect.y() + height * 20 - children[i].height() / 2
                });
            }
            return;
        }
        rect.position({
            x: Math.round((rect.x() < 0 ? 0 : ((rect.x() + width * 40) > workspaceWidth() ? (workspaceWidth() - width * 40) : rect.x())) / 40) * 40,
            y: Math.round((rect.y() < 0 ? 0 : ((rect.y() + height * 40) > workspaceHeight() ? (workspaceHeight() - height * 40) : rect.y())) / 40) * 40
        });
        for (let i = 0; i < children.length; i++) {
            children[i].position({
                x: rect.x() + width * 20 - children[i].width() / 2,
                y: rect.y() + height * 20 - children[i].height() / 2
            });
        }
        shadowRect.hide();
    });
    rect.on('dragmove', (e) => {
        for (let i = 0; i < children.length; i++) {
            children[i].position({
                x: rect.x() + width * 20 - children[i].width() / 2,
                y: rect.y() + height * 20 - children[i].height() / 2
            });
        }
        if (!gridOn)
            return;
        shadowRect.position({
            x: Math.round((rect.x() < 0 ? 0 : ((rect.x() + width * 40) > workspaceWidth() ? (workspaceWidth() - width * 40) : rect.x())) / 40) * 40,
            y: Math.round((rect.y() < 0 ? 0 : ((rect.y() + height * 40) > workspaceHeight() ? (workspaceHeight() - height * 40) : rect.y())) / 40) * 40
        });
    });

    rect.on('mouseover', function () {
        document.body.style.cursor = 'move';
    });
    rect.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });

    mainLayer.add(shadowRect);
    shadowRect.hide();

    mainLayer.add(rect);
    mainLayer.add(nameEl);

    return {rect: rect, name: nameEl, shadowRect: shadowRect};
}