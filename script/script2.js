let brouillon = document.getElementById('brouillon'),
    blanche = brouillon.getContext('2d')

/***** Effacer le canvas *****/
let clickX = []
let clickY = []
let clickDrag = []
let dessiner = false
let clickColor = []
let couleurCourante = "black"
let crayon = document.getElementById("crayon"),
    gomme = document.getElementById("gomme")
brouillon.addEventListener("click", function () {
    clickX = []
    clickY = []
    clickDrag = []
    clickColor = []
})

/***** Dessiner dans le canvas pour écrire les détails des opérations *****/

const tampon = function () {

    clickX.splice(clickX.length - 1, clickX.length - 1)
    clickY.splice(clickY.length - 1, clickY.length - 1)
    clickDrag.splice(clickDrag.length - 1, clickDrag.length - 1)
    clickColor.splice(clickColor.length - 1, clickColor.length - 1)

    redessiner()
}

const redessiner = function () {
    feuille.lineJoin = "round"
    /*feuille.lineWidth = 4*/

    for (var i = 0; i < clickX.length; i++) {
        blanche.beginPath()
        if (clickDrag[i] && i) {
            blanche.moveTo(clickX[i - 1], clickY[i - 1])
        } else {
            blanche.moveTo(clickX[i], clickY[i])
        }
        blanche.lineTo(clickX[i], clickY[i])
        blanche.closePath()
        blanche.strokeStyle = clickColor[i]
        blanche.stroke()
    }
}

const ajouterClick = function (x, y, dragging) {
    clickX.push(x)
    clickY.push(y)
    clickDrag.push(dragging)
    clickColor.push(couleurCourante)
}


brouillon.addEventListener("mousedown", function (e) {
    sourisX = e.pageX - this.offsetLeft
    sourisY = e.pageY - this.offsetTop
    dessiner = true
    ajouterClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop)

    redessiner()

})

brouillon.addEventListener("mousemove", function (e) {
    if (dessiner) {
        ajouterClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true)
        redessiner()
    }

})

brouillon.addEventListener("mouseup", function (e) {
    dessiner = false
})

gomme.addEventListener("click", function (e) {
    couleurCourante = "white"
    blanche.lineWidth = 100
})

crayon.addEventListener("click", function (e) {
    couleurCourante = "black"
    blanche.lineWidth = 2
})
