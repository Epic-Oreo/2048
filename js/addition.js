

const b = $("#undoButton").on("click", ()=>{
  undoButton()
})

const c = $("#clearUndo").on("click", ()=>{
  localStorage.setItem("undoState", JSON.stringify([]));
})


function undoButton () {

  const us = JSON.parse(localStorage.getItem("undoState"))

  if (us.length <= 1) return; // make sure there are more then two moves

  const last = us[1];

  us.shift();


  localStorage.setItem("gameState", JSON.stringify(last));

  localStorage.setItem("undoState", JSON.stringify(us));

  gmMain.grid = new Grid(last.grid.size, last.grid.cells);
  
  gmMain.actuate()
  
}

function updateUndoLog () {

  let data = JSON.parse(localStorage.getItem("undoState"));

  if (!data) {
    data = []
  }

  data = [JSON.parse(localStorage.getItem("gameState")) ].concat(data);

  if (data.length > 10) {
    data.pop();
  }

  localStorage.setItem("undoState", JSON.stringify(data))
}