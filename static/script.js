
var canvas = document.querySelector('canvas')
var background = new Image();
background.src = "image.png"
var ctx = canvas.getContext('2d')
background.onload = function () {
    canvas.height = background.height;
    canvas.width = background.width;
    ctx.drawImage(background,0,0);   
}

ctx.lineWidth = 5
var button = document.querySelector('button')
var mouse = { x: 0, y: 0 }
var mouse_xi = 0
var mouse_yi = 0
var line = []
var arr_lines = []
var count_vec = 0
var colors = ["green", "red"] 
var names = ["u", "v"]

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft
  mouse.y = e.pageY - this.offsetTop
})
canvas.onmousedown = () => {

  if (count_vec > 1) {
    return
  }
  

  mouse_xi = mouse.x
  mouse_yi = mouse.y
  canvas.addEventListener('mousemove', onPaint)
}
canvas.onmouseup = () => {
  count_vec = count_vec + 1
  arr_lines.push(line)
  //console.log(arr_lines)
  canvas.removeEventListener('mousemove', onPaint)
}

function drawLine(line) { 
  xi = line[0]
  yi = line[1]
  xf = line[2]
  yf = line[3]
  n = line[4]
  drawArrowhead([xf, yf, xi, yi, n])
  ctx.beginPath()
  ctx.moveTo(xi,yi)
  ctx.lineTo(xf, yf)
  

  ort = [xf - xi, -(yf - yi)]
  nm = Math.sqrt(ort[0] * ort[0] + ort[1] * ort[1]);
  ort[0] = ort[0] / nm
  ort[1] = ort[1] / nm
  ctx.fillStyle = colors[n];
  ctx.font = "30px Arial";
  ctx.fillText(names[n], (xi + xf)/2 + 20*ort[1], (yi + yf)/2 + 20*ort[0]);


  ctx.strokeStyle = colors[n];
  ctx.lineWidth = 7;
  ctx.stroke()
  drawArrowhead(line)
}



var PI2 = Math.PI * 2;
function drawArrowhead(line) {
    xi = line[0]
    yi = line[1]
    xf = line[2]
    yf = line[3]
    n = line[4]
    //drawLine(line)  
    var dx = xf - xi;
    var dy = yf - yi;
    var radians = (Math.atan2(dy, dx) + PI2) % PI2;
    ctx.save();
    //ctx.lineWidth = 60;
    ctx.beginPath();
    ctx.translate(xf, yf);
    ctx.rotate(radians);
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 6);
    ctx.lineTo(-10, -6);
    ctx.closePath();    
    ctx.fillStyle = colors[n];
    ctx.strokeStyle = colors[n];
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = colors[n];
    ctx.stroke()
}



var onPaint = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
  ctx.drawImage(background,0,0); 
  line = [mouse_xi, mouse_yi, mouse.x, mouse.y, count_vec]
  drawLine(line)
  //drawArrowhead(line)
  var i;
  for (i = 0; i < arr_lines.length; i++) {
    tmp_line = arr_lines[i]
    //drawArrowhead(tmp_line)
    drawLine(tmp_line)
  }
 
}


function resetState() {

  count_vec = 0
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
  ctx.drawImage(background, 0, 0);
  line = []
  arr_lines = []
  
}



$('#mysubmit').click(function (e) {

  e.preventDefault();
  if (count_vec <= 1) {
    alert("faltan parametros")
    return false
  }

  
    var obj = { u: {size : $('#u').val(), vec : arr_lines[0].slice(0, 4)}, v: {size : $('#v').val(), vec : arr_lines[1].slice(0, 4)}};
    var data = JSON.stringify(obj);
    
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: "/",
        dataType : 'json',
        data: data,
        success: function (data) {
            alert("bien");
        },error : function(result){
            //alert("error");
       }
    });

 

   
})

//data: JSON.stringify({ "text" : value } )











