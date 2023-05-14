// canvas.addEventListener('mousemove', onClick)

const saveBtn = document.getElementById("save")
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
  ); //div 각각 안에 색상 넣어놓고 한번에 찾아온다. 요소들을 리턴
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = 'round'
let isPainting = false;
let isFilling = false;

// 그림판처럼 마우스를 드래그하면 선이 그려진다
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}
function onMouseDown() {
  isPainting = true;
}
function onMouseUp() {
  isPainting = false;
}

//글 굵기 조절 input값이 바뀔 때마다 함수 실행
function onLineWidthChnage(event) {
  ctx.lineWidth = event.target.value;
}
// 선 색상 변경= strokeStyle, 채우기변경= fillStyle
function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
//색상칸 선택 기능
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}
//그리기, 채우기 버튼 스위치 기능
function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Drow";
  }
}

//그리기와 채우기,fillRect=현재 선택된 색으로 그린다는 의미
function onCanvasClick() {
  if(isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
// 삭제 기능
function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
// 지우기 기능
function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

//파일 선택,이미지 삽입 기능
function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
} 
// 더블 클릭 문자 삽입 기능
function onDoubleClick(event) {
  ctx.save()//현재 상태, 색,스타일 등 모든 것 저장
  const text = textInput.value
  //빈칸에 텍스트가 없을 때 아무 작업을 하지 않는다.
  if(text !=='') {
    ctx.save()
    ctx.lineWidth = 1;
    ctx.font = "20px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); //저장해뒀던 상태로 되돌린다, 기존의 첵포인트로 돌아감
  }
}
// 그린 그림 저장
function onSaveClick() {
  const url = canvas.toDataURL()
  const a = document.createElement('a')
  a.href = url
  a.download = 'myDrawing.png'
  a.click()
}


canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp); // 1번 방법
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChnage);
color.addEventListener("change", onColorChange);
fileInput.addEventListener("change", onFileChange);
// canvas.onmousemove = onMove

//영역 밖으로 나갔다 들어와도 선이 그려지는데 그 오류를 고치는 코드//
//canvas.addEventListener('mouseleave', cancelPainting)// (1-1번 방법 단, 그 위의 'mouseup'뒤의 부분도 같은 cancelPainting을 입력한다  그리고 'mousedown' 뒤에는 startPainting으로 바꿔주면 됨)
//document.addEventListener('mouseup', onMouseUp)//2번 방법
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
saveBtn.addEventListener("click", onSaveClick)

