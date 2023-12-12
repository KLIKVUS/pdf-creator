// Настройки
let imgUrl = "";
let tableData = "";
let dragdivtextStyle = {
    "color": "#fff",
    "font-size": "24px",
    "text-align": "left",
}
let textArray = [];
//

// Элементы для таскания
const dragdiv = document.querySelectorAll(".drag-div");
// 

// Обертка картики
const pdfPreview = document.getElementById("pdf-preview");
//


// Перетаскивание блока
dragdiv.forEach(elem => {
    dragElement(elem);
})

function dragElement(elmnt) {
    // Элементы куда будет подставлен текст
    const dragdivtext = elmnt.querySelector(".drag-div-text");
    // 

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    
    if (dragdivtext) dragdivtext.onmousedown = dragMouseDown;
    else elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let pdfPreviewHeigh = pdfPreview.offsetHeight;
        let dragdivHeight = elmnt.offsetHeight;

        let pdfPreviewWidth = pdfPreview.offsetWidth;
        let dragdivWidth = elmnt.offsetWidth;

        let topPos = (elmnt.offsetTop - pos2) < 0 ? 0 : (elmnt.offsetTop - pos2) > pdfPreviewHeigh - dragdivHeight ? pdfPreviewHeigh - dragdivHeight : (elmnt.offsetTop - pos2);
        let leftPos = (elmnt.offsetLeft - pos1) < 0 ? 0 : (elmnt.offsetLeft - pos1) > pdfPreviewWidth - dragdivWidth ? pdfPreviewWidth - dragdivWidth : (elmnt.offsetLeft - pos1);

        elmnt.style.top = topPos + "px";
        elmnt.style.left = leftPos + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
// 


// Ссылка на картинку
const fileUploader = document.getElementById("file-uploader");
const reader = new FileReader();
const imgArea = document.getElementById("img-area");

fileUploader.addEventListener("change", (event) => {
    const files = event.target.files;
    const file = files[0];

    imgUrl = URL.createObjectURL(file);
    imgArea.src = imgUrl;
});
//


// Ссылка на файл таблицы
const tableFileUploader = document.getElementById("table-file-uploader");

tableFileUploader.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    tableData = await file.arrayBuffer();
});
// 


// // Формирую массив с текстом из input
// const varsInput = document.getElementById("vars-input");

// varsInput.addEventListener("change", (event) => {
//     if (!event.target.value) return;
//     textArray = event.target.value.split("\n").filter(i => i);
// });
// //


// Получаем цвет текста
const colorInput = document.getElementById("text-color");

colorInput.addEventListener("change", (event) => {
    dragdivtextStyle["color"] = event.target.value;
});
//


// Получаем размер текста
const sizeInput = document.getElementById("text-size");

sizeInput.addEventListener("change", (event) => {
    dragdivtextStyle["font-size"] = event.target.value;
    dragdiv.forEach(elem => {
        elem.querySelector(".drag-div-text").style.fontSize = dragdivtextStyle["font-size"] + "px";
    })
});
//


// Текст по центру документа
const textposCheckbox = document.getElementById("text-pos");

textposCheckbox.addEventListener("change", (event) => {
    switch (event.target.checked) {
        case true:
            dragdivtextStyle["text-align"] = "center";

            dragdiv.forEach(elem => {
                elem.style.width = "100%";
                elem.querySelector(".drag-div-text").style.textAlign = "center";
            })
            break;
        case false:
            dragdivtextStyle["text-align"] = "left";
            
            dragdiv.forEach(elem => {
                elem.style.width = "auto";
                elem.querySelector(".drag-div-text").style.textAlign = "left";
            })
            break;
    }
});
// 


// Отступы у текста
const textPaddingInput = document.getElementById("text-padding");

textPaddingInput.addEventListener("change", (event) => {
    const padding = event.target.value;

    dragdiv.forEach(elem => {
        const dragdivtext = elem.querySelector(".drag-div-text");
        
        dragdivtext.style.marginLeft = padding + "px";
        dragdivtext.style.marginRight = padding + "px";
    })
});
// 


// Скрыть второй текст
const hideTextCheckbox = document.getElementById("hide-text");
hideTextCheckbox.addEventListener("change", () => {
    dragdiv[1].classList.toggle("hidden");
});
// 


// // Добавить таскаемый div
// function addDragText() {
//     const curdragdiv = document.createElement("div");
//     const curdragdivtext = document.createElement("div");

//     curdragdiv.classList.add("drag-div");
    
//     curdragdivtext.classList.add("drag-div");
//     curdragdivtext.innerText = "Текст"+dragdiv.length;
//     curdragdivtext.style.fontSize = dragdivtextStyle["font-size"];

//     curdragdiv.appendChild(curdragdivtext);
//     pdfPreview.appendChild(curdragdiv);
// }
// // 


// // Удалить таскаемый div
// function addDragText() {
//     lastParagraph.parentNode.removeChild(lastParagraph)
// }
// // 


// Создаем pdf
function generatePDF({ text, HTML_Width, HTML_Height }) {
    html2pdf()
        .set({
            margin: 0,
            filename: text + ".pdf",
            html2canvas: {
                x: 0, y: 0,
                scale: 1,
                width: HTML_Width,
                height: HTML_Height,
                windowWidth: HTML_Width,
                windowHeight: HTML_Height,
                scrollX: 0,
                scrollY: 0,
                allowTaint: true,
                imageTimeout: 0
            },
            jsPDF: {
                compress: true,
                unit: "px",
                format: [HTML_Width, HTML_Height],
                hotfixes: ["px_scaling"]
            }
        })
        .from(pdfPreview)
        .save();
}
// 


// Запускаем создание pdf файлов
function startPdfGenerator() {
    if (!tableData) return alert("Нужен файл с данными!");
    
    let counter = 0;
    let HTML_Width = pdfPreview.offsetWidth;
    let HTML_Height = pdfPreview.scrollHeight;

    const dragdivtext = document.querySelectorAll(".drag-div-text");
    
    const wb = XLSX.read(tableData);
    textArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {raw:false});

    dragdivtext.forEach(elem => {
        elem.classList.remove("drag-div-text");
        Object.assign(elem.style, dragdivtextStyle);
    })

    const interval = setInterval(() => {
        let text = textArray[counter];

        dragdivtext.forEach((elem, i) => {
            if (!text && counter) {
                elem.classList.add("drag-div-text");
                elem.style = "";
                elem.style.fontSize = dragdivtextStyle["font-size"] + "px";
                elem.innerText = "Текст" + (i + 1);
    
                return;
            }

            if (!text) return elem.innerText = "Тестовый текст" + (i + 1);
            if (text["text"+(i+1)]) return elem.innerText = text["text"+(i+1)].trim();

            elem.innerText = "";
        })

        if (!text && counter) {
            clearInterval(interval);
            return;
        }

        console.log(text["fileName"])
        generatePDF({ text: text ? text["fileName"].trim() : `Файл ${counter}`, HTML_Width, HTML_Height });
        ++counter;
    }, 250)
}
// 