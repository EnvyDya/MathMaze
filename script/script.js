let sprite = document.getElementById('scene'),
    repere = sprite.getContext('2d'),
    boutonGomme = document.getElementById('gomme'),
    boutonCrayon = document.getElementById('crayon')

if (document.body)
{
var larg = (document.body.clientWidth);
console.log("largeur fenetre " + larg)
}

let tailleRecup = larg/1.9,
    tailleRecupBoite = larg/2.8,
    tailleRecupApres = `${tailleRecup}px`,
    tailleRecupBoiteApres = `${tailleRecupBoite}px`,
    carreBlanc = document.getElementById('fondBlanc'),
    largeurQuestion = document.getElementById('laBulle'),
    logo = document.getElementById('logo')

logo.addEventListener("click", function () {
    javascript:window.location.reload()
})
    
carreBlanc.style.width = tailleRecupApres
largeurQuestion.style.width = tailleRecupBoiteApres


let feuille = document.getElementById('brouillon')
// Création perso
let perso = new Image(),
    persoX = 292,
    persoY = 40,
    persoW = 64,
    persoH = 64,
    persoAfficheW = 30,
    persoAfficheH = 30,
    ligne = 0,
    colonne = 0,
    margeDroitePerso = 0,
    margeGauchePerso = 0,
    margeHautPerso = 13,
    margeBasPerso = 0,
    bloquePG = false,
    bloquePD = false,
    bloquePH = false,
    bloquePB = false,
    hitboxVerticale = (persoAfficheH - (margeBasPerso + margeHautPerso)) * 3 * 255,
    /* Nombre de composante RGB pour que tous les pixels soient blancs
    Hauteur du perso * 3 composantes * 255 (blanc) */
    hitboxHorizontale = (persoAfficheW - (margeDroitePerso + margeGauchePerso)) * 3 * 255
/* Nombre de composante RGB pour que tous les pixels soient blancs
largeur - les marges du perso * 3 composantes * 255 (blanc) */

perso.src = `images/perso3.png`

// Fonction qui récupère les composantes RGB et qui retourne l'addition de toutes celles ci dans la variable compo
function recupRGB(donnee) {
    let data = donnee.data,
        compo = 0
    for (let i = 0; i < data.length; i = i + 4) {
        let R = data[i],
            G = data[i + 1],
            B = data[i + 2]
        compo = compo + R + G + B // Récupère les composantes RGB de tous les pixels sur la zone de détection
    }
    return compo
}

// Création du labyrinthe
let laby = new Image()
laby.src = 'images/HGBD.png'

// Création labyrinthe de test
let laby2 = new Image()
laby2.src = 'images/undermapHGBD.png'


let RGBR1, RGBR2, RGBR3, RGBL1, RGBL2, RGBL3, RDBU1, RGBU2, RGBU3, RGBD1, RGBD2, RGBD3

function mouvementPerso(x, y, p, w, h, aW, aH, ctx) {
    window.addEventListener('keydown', function (touche) {
        if (bloque == false) {
            // Création du canvas de test (seulement en noir et blanc)
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(laby2, 0, 0)
            //Tout ce qu'on effectue au premier appui
            sprite.style.display = 'block'
            sprite.style.border = 'solid'
            bulleQuestion.style.visibility = 'hidden'
            // On détecte quelle touche est appuyée
            let toucheClavier = touche.key

            switch (toucheClavier) {

                case 'ArrowRight':
                    let labyDataRight = ctx.getImageData(x + aW - margeDroitePerso + 1, y + margeHautPerso, 1, aH - margeHautPerso),
                        RGBR = recupRGB(labyDataRight)
                    if (x < (600 - aW) && (RGBR == hitboxVerticale)) {
                        x++
                    }
                    // Création d'une zone de détection en bas à droite
                    let detectBasDR = ctx.getImageData(x + aW - margeDroitePerso + 1, y + aH - 1, 1, 1)
                    RGBR1 = recupRGB(detectBasDR)

                    // Création d'une zone de détection au milieu à droite
                    let detectMilieuDR = ctx.getImageData(x + aW - margeDroitePerso + 1, y + aH / 2, 1, 1)
                    RGBR2 = recupRGB(detectMilieuDR)

                    // Création d'une zone de détection en haut à droite
                    let detectHautDR = ctx.getImageData(x + aW - margeDroitePerso + 1, y, 1, 1)
                    RGBR3 = recupRGB(detectHautDR)

                    // Passage de porte + question
                    if (((RGBR1 || RGBR2 || RGBR3) == 255) && (bloquePD == false)) {
                        repere.clearRect(0, 0, 600, 600)
                        gandalfHTML.style.visibility = "visible"
                        carreBlanc.style.visibility = "visible"
                        choixActu = droite
                        choixActuT = droiteT
                        laQuestionChoisie2 = aleaQuestion()
                        bloque = true
                        bloquePG = true
                        bloquePD = false
                        bloquePH = false
                        bloquePB = false
                        x = 35
                        y = 290
                        ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
                    }
                    
                    //Secreeeeeet
                    if ((RGBR1 || RGBR2 || RGBR3) == 510) {
                        laby.src = secret.src
                        laby2.src = secretT.src
                        x = 290
                        y = 350
                        bloquePG = false
                        bloquePD = false
                        bloquePH = false
                        bloquePB = false
                        nbrPoints = nbrPoints + 1000
                    }

                    ligne = 2 * h
                    break
                case 'ArrowLeft':
                    let labyDataLeft = ctx.getImageData(x + margeGauchePerso - 1, y + margeHautPerso, 1, aH - margeHautPerso),
                        RGBL = recupRGB(labyDataLeft)
                    if ((x > 0) && (RGBL == hitboxVerticale)) {
                        x--
                    }

                    // Création d'une zone de détection en bas à gauche
                    let detectBasGL = ctx.getImageData(x + margeGauchePerso - 1, y + aH - 1, 1, 1)
                    RGBL1 = recupRGB(detectBasGL)

                    // Création d'une zone de détection au milieu à gauche
                    let detectMilieuGL = ctx.getImageData(x + margeGauchePerso - 1, y + aH / 2, 1, 1)
                    RGBL2 = recupRGB(detectMilieuGL)

                    // Création d'une zone de détection en haut à gauche
                    let detectHautGL = ctx.getImageData(x + margeGauchePerso - 1, y, 1, 1)
                    RGBL3 = recupRGB(detectHautGL)

                    // Passage de porte + question
                    if (((RGBL1 || RGBL2 || RGBL3) == 255) && (bloquePG == false)) {
                        repere.clearRect(0, 0, 600, 600)
                        gandalfHTML.style.visibility = "visible"
                        carreBlanc.style.visibility = "visible"
                        choixActu = gauche
                        choixActuT = gaucheT
                        laQuestionChoisie2 = aleaQuestion()
                        bloque = true
                        bloquePG = false
                        bloquePD = true
                        bloquePH = false
                        bloquePB = false
                        x = 535
                        y = 290
                        ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
                    }
    
                    //Secreeeeeet
                    if ((RGBL1 || RGBL2 || RGBL3) == 510) {
                        laby.src = secret.src
                        laby2.src = secretT.src
                        x = 290
                        y = 350
                        bloquePG = false
                        bloquePD = false
                        bloquePH = false
                        bloquePB = false
                        nbrPoints = nbrPoints + 1000
                    }


                    ligne = 0 * h
                    break
                case 'ArrowUp':
                    let labyDataUp = ctx.getImageData(x + margeGauchePerso, y, aW - margeDroitePerso - margeGauchePerso, 1),
                        RGBU = recupRGB(labyDataUp)
                    if ((y > 0) && (RGBU == hitboxHorizontale)) {
                        y--
                    }

                    // Création d'une zone de détection à gauche en haut
                    let detectHautGU = ctx.getImageData(x + margeGauchePerso, y, 1, 1)
                    RGBU1 = recupRGB(detectHautGU)

                    // Création d'une zone de détection au milieu en haut
                    let detectMilieuU = ctx.getImageData(x + margeGauchePerso + aW / 2, y, 1, 1)
                    RGBU2 = recupRGB(detectMilieuU)

                    // Création d'une zone de détection à droite en haut
                    let detectHautDU = ctx.getImageData(x + margeGauchePerso + aW, y, 1, 1)
                    RGBU3 = recupRGB(detectHautDU)

                    // Passage de porte + question
                    if (((RDBU1 || RGBU2 || RGBU3) == 255) && (bloquePH == false)) {
                        repere.clearRect(0, 0, 600, 600)
                        gandalfHTML.style.visibility = "visible"
                        carreBlanc.style.visibility = "visible"
                        choixActu = haut
                        choixActuT = hautT
                        laQuestionChoisie2 = aleaQuestion()
                        bloque = true
                        bloquePG = false
                        bloquePD = false
                        bloquePH = false
                        bloquePB = true
                        x = 295
                        y = 510
                        ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
                    }

                    //Secreeeeeet
                    if ((RGBU1 || RGBU2 || RGBU3) == 510) {
                        laby.src = secret.src
                        laby2.src = secretT.src
                        x = 290
                        y = 350
                        bloquePG = false
                        bloquePD = false
                        bloquePH = false
                        bloquePB = false
                        nbrPoints = nbrPoints + 1000
                    }

                    ligne = -1 * h
                    break
                case 'ArrowDown':
                    // On récupère le pixel sous le personnage
                    let labyDataDown = ctx.getImageData(x + margeGauchePerso, y + aH + 1, aW - margeDroitePerso - margeGauchePerso, -1),
                        RGBD = recupRGB(labyDataDown)
                    // Si y n'est pas hors du cadre et que la somme des composantes couleurs = à la taille de la hitbox basse * 255
                    if (y < (600 - aH) && (RGBD == hitboxHorizontale)) {
                        y++
                    }

                    // Création d'une zone de détection en bas à droite
                    let detectBasDD = ctx.getImageData(x + margeGauchePerso, y + aH + 1, 1, 1)
                    RGBD1 = recupRGB(detectBasDD)

                    // Création d'une zone de détection au milieu en bas
                    let detectMilieuD = ctx.getImageData(x + margeGauchePerso + aW / 2, y + aH + 1, 1, 1)
                    RGBD2 = recupRGB(detectMilieuD)

                    // Création d'une zone de détection en bas à gauche
                    let detectBasGD = ctx.getImageData(x + margeGauchePerso + aW, y + aH + 1, 1, 1)
                    RGBD3 = recupRGB(detectBasGD)

                    // Passage de porte + question
                    if (((RGBD1 || RGBD2 || RGBD3) == 255) && (bloquePB == false)) {
                        repere.clearRect(0, 0, 600, 600)
                        gandalfHTML.style.visibility = "visible"
                        carreBlanc.style.visibility = "visible"
                        choixActu = bas
                        choixActuT = basT
                        laQuestionChoisie2 = aleaQuestion()
                        bloque = true
                        bloquePG = false
                        bloquePD = false
                        bloquePH = true
                        bloquePB = false
                        x = 295
                        y = 35
                        ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
                    }
                    
                    //Secreeeeeet
                    if ((RGBD1 || RGBD2 || RGBD3) == 510) {
                        laby.src = secret.src
                        laby2.src = secretT.src
                        x = 290
                        y = 350
                        bloquePG = false
                        bloquePD = false
                        bloquePH = false
                        bloquePB = false
                        nbrPoints = nbrPoints + 1000
                    }

                    ligne = 1 * h
                    break
            }
            colonne = (colonne + w) % (3 * w)

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(laby, 0, 0)
            ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText("score : " + nbrPoints, 10, 20)

            if (bloque == true) {
                //on écrit la question
                bulleQuestion.innerHTML = (boiteQ[questionChoisie].question)
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, bulleQuestion])
                bulleQuestion.style.visibility = 'visible'
                sprite.style.display = 'none'
                sprite.style.border = 'hidden'
                feuille.style.display = 'block'
                feuille.style.border = 'solid'
                boutonGomme.style.visibility = "visible"
                boutonCrayon.style.visibility = "visible"
            }
        }
    })

    /* Personnage en position d'attente */

    window.addEventListener('keyup', function (touche) {
        if (bloque == false) {
            let toucheClavier = touche.key
            console.log(toucheClavier)

            switch (toucheClavier) {
                case 'ArrowRight':
                    ligne = 2 * h
                    break
                case 'ArrowLeft':
                    ligne = 0 * h
                    break
                case 'ArrowUp':
                    ligne = -1 * h
                    break
                case 'ArrowDown':
                    ligne = 1 * h
                    break
            }
            colonne = w

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(laby, 0, 0)
            ctx.drawImage(p, colonne + h, ligne + w, w, h, x, y, aW, aH)
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText("score : " + nbrPoints, 10, 20)

            if (bloque == true) {
                //on écrit la phrase de question
                bulleQuestion.innerHTML = boiteQ[questionChoisie].question
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, bulleQuestion])
                sprite.style.display = 'none'
                sprite.style.border = 'hidden'
                feuille.style.display = 'block'
                feuille.style.border = 'solid'
            }
        }
    })

}

perso.addEventListener('load', function () {
    repere.drawImage(perso, persoW, persoH, persoW, persoH, persoX, persoY, persoAfficheW, persoAfficheH)
    mouvementPerso(persoX, persoY, perso, persoW, persoH, persoAfficheW, persoAfficheH, repere)
})

laby2.addEventListener('load', function () {})

laby.addEventListener('load', function () {
    repere.drawImage(laby, 0, 0)
    repere.fillText("score : " + nbrPoints, 10, 20)
    repere.fillStyle = "#FFFFFF"

})


// Partie questions des zigottos

let nbrPoints = 0,
    choixActu,
    choixActuT,
    bloque = false,
    gandalfHTML = document.getElementById('zeGandalf'),
    boutonVF1 = document.getElementById('bouton1'),
    boutonVF2 = document.getElementById('bouton2'),
    boutonVF3 = document.getElementById('bouton3'),
    boutonVF4 = document.getElementById('bouton4'),
    recupAlea,
    bulleQuestion = document.getElementById('laBulle')


//----------------------DEFINITIONS IMAGES---------------------------
let HB = new Image(600, 600)
HB.src = 'images/HB.png'

let HBT = new Image(600, 600)
HBT.src = 'images/undermapHB.png'

let BD = new Image(600, 600)
BD.src = 'images/BD.png'

let BDT = new Image(600, 600)
BDT.src = 'images/undermapBD.png'

let GBD = new Image(600, 600)
GBD.src = 'images/GBD.png'

let GBDT = new Image(600, 600)
GBDT.src = 'images/undermapGBD.png'

let GB = new Image(600, 600)
GB.src = 'images/GB.png'

let GBT = new Image(600, 600)
GBT.src = 'images/undermapGB.png'

let GD = new Image(600, 600)
GD.src = 'images/GD.png'

let GDT = new Image(600, 600)
GDT.src = 'images/undermapGD.png'

let GHD = new Image(600, 600)
GHD.src = 'images/GHD.png'

let GHDT = new Image(600, 600)
GHDT.src = 'images/undermapGHD.png'

let HDB = new Image(600, 600)
HDB.src = 'images/HDB.png'

let HDBT = new Image(600, 600)
HDBT.src = 'images/undermapHDB.png'

let HD = new Image(600, 600)
HD.src = 'images/HD.png'

let HDT = new Image(600, 600)
HDT.src = 'images/undermapHD.png'

let HGBD = new Image(600, 600)
HGBD.src = 'images/HGBD.png'

let HGBDT = new Image(600, 600)
HGBDT.src = 'images/undermapHGBD.png'

let HGB = new Image(600, 600)
HGB.src = 'images/HGB.png'

let HGBT = new Image(600, 600)
HGBT.src = 'images/undermapHGB.png'

let HG = new Image(600, 600)
HG.src = 'images/HG.png'

let HGT = new Image(600, 600)
HGT.src = 'images/undermapHG.png'

let secret = new Image(600,600)
secret.src = 'images/Secret.png'

let secretT = new Image(600,600)
secretT.src = 'images/undermapSecret.png'


//--------------------DEFINITION DES MAPS (générateur procédural)------------------------
//on définie toutes les cartes en fonction de la sortie utilisée sur la carte précédente
let haut = [BD, GBD, GB, HB, HDB, HGBD, HGB],
    bas = [GHD, HB, HDB, HD, HGBD, HGB, HG],
    gauche = [BD, GBD, GD, GHD, HDB, HD, HGBD],
    droite = [GBD, GB, GD, GHD, HGBD, HGB, HG],
    hautT = ["BD", "GBD", "GB", "HB", "HDB", "HGBD", "HGB"],
    basT = ["GHD", "HB", "HDB", "HD", "HGBD", "HGB", "HG"],
    gaucheT = ["BD", "GBD", "GD", "GHD", "HDB", "HD", "HGBD"],
    droiteT = ["GBD", "GB", "GD", "GHD", "HGBD", "HGB", "HG"],
    questionChoisie = null,
    laQuestionChoisie2 = null

//---------STOCK QUESTIONS---------//
//la boiteQ est là où tous les objets question sont stockés
let boiteQ = [
    {
        type: "VF",
        question: "On considère les suites suivantes : \\(Un = \\int_1^2 \\frac{ln(x)}{x} dx~et~ Vn = ln(2)^n  \\) Pour tout n \\(\\in \\mathbb{N}\\), Un\\(\\lt \\)Vn ?",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
    {
        type: "VF",
        question: "\\(I_1 = \\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{3}} \\frac{cos(x)}{sin(x)} dx et I_2 = \\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{3}} \\frac{sin(x)}{cos(x)} dx  \\) <br>Question : \\(\\frac{\\pi}{6\\sqrt{3}} \\le I_2 \\le \\frac{\\pi\\sqrt{3}}{6}\\) ?",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "z= 1- tan^2a+2itan(a) ou a \\(\\in \\) ]\\(-\\frac{\\pi}{4} ; 0\\)[  Question : Arg(z)= a+2k\\(\\pi\\)",
        bonneReponse: "Faux",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
    {
        type: "classico",
        question: "cos(\\(\\pi + x\\))- sin(\\(\\frac{\\pi}{2} - x\\)) = ?",
        bonneReponse: "-cos(x) -sin(x)",
        reponse1: "-cos(x) -sin(x)",
        reponse2: "-cos(x) + sin(x)",
        reponse3: "cos(x) -sin(x)",
        reponse4: "cos(x) +sin(x)"
    },
     {
        type: "classico",
        question: "f(x) =\\(\\frac{3x-1}{5-4x}\\) <br>f'(x) = ?",
        bonneReponse: "\\(\\frac{11}{(5-4x)^2}\\)",
        reponse1: "\\(\\frac{-3}{4}\\)",
        reponse2: "\\(\\frac{19-24x}{(5-4x)^2}\\)",
        reponse3: "\\(\\frac{11}{(5-4x)^2}\\)",
        reponse4: "\\(\\frac{-12x^2+19x-5}{(5-4x)^2}\\)"
    },
     {
        type: "classico",
        question: "La solution de ln(\\(\\frac{1-x}{1+x})\\)",
        bonneReponse: "]-1;\\(\\frac{1}{3}\\)[",
        reponse1: "[\\(\\frac{1}{3}\\);1[",
        reponse2: "[\\(\\frac{1}{3}\\);+\\(\\infty\\)[",
        reponse3: "]-\\(\\infty\\);\\(\\frac{1}{3}\\)[",
        reponse4: "]-1;\\(\\frac{1}{3}\\)["
    },
     {
        type: "classico",
        question: "\\(\\lim_{x \\to 0} \\frac{x}{ln(1+x)}\\) ?",
        bonneReponse: "1",
        reponse1: "0",
        reponse2: "1",
        reponse3: "+\\(\\infty\\)",
        reponse4: "-1"
    },
     {
        type: "classico",
        question: "f(x)= 2x-ln(1+2x) alors f'(x)= ?",
        bonneReponse: "\\(\\frac{4x}{1+2x}\\)",
        reponse1: "2-\\(\\frac{1}{1+2x}\\)",
        reponse2: "\\(\\frac{4x}{1+2x}\\)",
        reponse3: "\\(\\frac{x}{1+2x}\\)",
        reponse4: "\\(\\frac{2}{1+2x}\\)"
    },
     {
        type: "classico",
        question: "1-\\(\\frac{3e^{x}+4}{e^{x}+4}\\)= ?",
        bonneReponse: "\\(\\frac{-2}{1+4e^{-x}}\\)",
        reponse1: "\\(1+2e^x\\)",
        reponse2: "-2",
        reponse3: "\\(\\frac{-2}{1+4e^{-x}}\\)",
        reponse4: "\\(\\frac{4e^{x}}{e^{x+4}}\\)"
    },
     {
        type: "VF",
        question: "\\(\\frac{e^{2x}-1}{e^{2x}+1}\\) = \\(\\frac{1-e^{-2x}}{1+e^{2x}}\\)",
        bonneReponse: "Faux",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "\\(e^{x}-2+\\)\\(e^{-x}\\) = \\(\\frac{(e^{x}-1)^2}{e^{x}}\\)",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "classico",
        question: "f(x)= \\(e^{2cos(x)}\\) alors f'(x)= ?",
        bonneReponse: "\\(-2sin(x)*e^{2cos(x)}\\)",
        reponse1: "\\(2cos(x)*e^{2cos(x)}\\)",
        reponse2: "\\(-2sin(x)*e^{2cos(x)}\\)",
        reponse3: "\\(-2e^{2cos(x)}\\)",
        reponse4: "\\(sin(x)+e^{2cos(x)}\\)"
    },
     {
        type: "VF",
        question: "\\(\\lim_{x \\to -\\infty} \\frac{e^{-x}}{e^{2x}+5}= 0\\) ?",
        bonneReponse: "Faux",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "classico",
        question: "\\(\\frac{4+5i}{-2+i}= ?\\)",
        bonneReponse: "\\(\\frac{-3}{5}-\\frac{14}{5}i\\)",
        reponse1: "\\(\\frac{-3}{5}-\\frac{14}{5}i\\)",
        reponse2: "\\(\\frac{-3}{5}+\\frac{14}{5}i\\)",
        reponse3: "\\(\\frac{3}{5}-\\frac{14}{5}i\\)",
        reponse4: "\\(\\frac{3}{5}*\\frac{14}{5}i\\)"
    },
     {
        type: "classico",
        question: "\\(arg(-2-2\\sqrt{3})= ?\\)",
        bonneReponse: "\\(\\frac{-2\\pi}{3}\\)",
        reponse1: "\\(\\frac{-\\pi}{3}\\)",
        reponse2: "\\(\\frac{-2\\pi}{3}\\)",
        reponse3: "\\(\\frac{\\pi}{3}\\)",
        reponse4: "\\(\\frac{2\\pi}{3}\\)"
    },
     {
        type: "classico",
        question: "Forme trigonométrique de \\(\\sqrt{3}-3i\\) ?",
        bonneReponse: "\\(5\\sqrt{3}(cos\\frac{-\\pi}{3}+sin\\frac{-\\pi}{3})\\)",
        reponse1: "\\(\\sqrt{12}(cos\\frac{\\pi}{3}-sin\\frac{\\pi}{3})\\)",
        reponse2: "\\(4\\sqrt{3}(cos\\frac{\\pi}{3}-sin\\frac{\\pi}{3})\\)",
        reponse3: "\\(\\sqrt{12}(cos\\frac{-\\pi}{3}-sin\\frac{\\pi}{3})\\)",
        reponse4: "\\(5\\sqrt{3}(cos\\frac{-\\pi}{3}+sin\\frac{-\\pi}{3})\\)"
    },
     {
        type: "classico",
        question: "Forme exponentielle de z= \\(\\frac{\\sqrt{3}+3i}{2i}\\) ?",
        bonneReponse: "\\(\\sqrt{3}e^{-i\\frac{\\pi}{6}}\\)",
        reponse1: "\\(3e^{-i\\frac{\\pi}{6}}\\)",
        reponse2: "\\(\\sqrt{3}e^{-i\\frac{\\pi}{3}}\\)",
        reponse3: "\\(\\sqrt{3}e^{-i\\frac{\\pi}{6}}\\)",
        reponse4: "\\(3e^{-i\\frac{\\pi}{3}}\\)"
    },
     {
        type: "classico",
        question: "Un= \\(\\frac{3^{n+1}}{5^{n+2}}\\) <br>Quelle est la limite de Un ?",
        bonneReponse: "0",
        reponse1: "0",
        reponse2: "\\(\\frac{3}{5}\\)",
        reponse3: "\\(+\\infty\\)",
        reponse4: "\\(\\frac{3}{25}\\)"
    },
     {
        type: "classico",
        question: "Un est définie par \\(Uo= -2 \\:\\:et\\:\\: Un+1= \\frac{1}{2}Un+3\\)",
        bonneReponse: "Un converge vers 6",
        reponse1: "Un est décroissante",
        reponse2: "Un converge vers 1",
        reponse3: "Un converge vers 6",
        reponse4: "Un n'est pas majorée"
    },
     {
        type: "VF",
        question: "\\(\\lim_{n \\to +\\infty} -3 (\\frac{9}{11})^{n}= -\\infty\\) ?",
        bonneReponse: "Faux",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "\\(\\lim_{n \\to +\\infty} -n^{2}+2= -\\infty\\) ?",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "\\(\\lim_{n \\to +\\infty} 5(\\sqrt{2})^{n}= +\\infty\\) ?",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "\\(f(x)= 3x^{2}-2x+1.\\:\\: Sa\\:\\: primitive\\:\\: est\\:\\: F(x)= x^{3}-x^{2}+x+k\\)",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "VF",
        question: "\\(f(x)= \\frac{1}{2x^{5}}.\\:\\: Sa\\:\\: primitive\\:\\: est\\:\\: F(x)= \\frac{-1}{8x^{4}}+k\\)",
        bonneReponse: "Vrai",
        reponse1: "Vrai",
        reponse2: "Faux"
    },
     {
        type: "classico",
        question: "\\(f(x)= \\frac{3x-1}{2x-1}\\:\\:donc\\:\\:f'(x)=\\:\\:?\\)",
        bonneReponse: "\\(\\frac{-1}{(2x-1)^{2}}\\)",
        reponse1: "\\(\\frac{3}{2}\\)",
        reponse2: "\\(\\frac{-3}{2x+1}\\)",
        reponse3: "\\(\\frac{-1}{(2x-1)^{2}}\\)",
        reponse4: "0"
    },
     {
        type: "classico",
        question: "Quelle suite n’a pas pour limite +\\(\\infty\\) ?",
        bonneReponse: "Un = 10 × 0,2n",
        reponse1: "Un = 5n",
        reponse2: "Un = −4 + 0,2n",
        reponse3: "Un = 10 × 0,2n",
        reponse4: "Un = \\(\\frac{n}{100}\\)"
    },
     {
        type: "classico",
        question: "Quelle relation la suite (un) définie par un = \\(2n^{2}-1\\) ne vérifie pas ?",
        bonneReponse: "\\(U_{n+1} = 2n^{2}+4n\\)",
        reponse1: "\\(U_{2n} = 8n^{2} -1\\)",
        reponse2: "\\(U_{2n+1} = 8n^{2} +8n +1\\)",
        reponse3: "\\(U_{n+1} = 2n^{2}+4n\\)",
        reponse4: "\\(U_{n+1}-U_n = 4n+2\\)"
    },
     {
        type: "classico",
        question: "Si f(x)= \\((x^{2}+1)e^{x}\\) alors f'(x)= ?",
        bonneReponse: "\\((x+1)^{2}e^{x}\\)",
        reponse1: "\\((x^{2}+1)e^{x}\\)",
        reponse2: "\\(x^{2}e^{x}\\)",
        reponse3: "\\((x+1)^{2}e^{x}\\)",
        reponse4: "\\(2xe^{x}\\)"
    },
     {
        type: "classico",
        question: "(5-4i)(2+3i)= ?",
        bonneReponse: "22+7i",
        reponse1: "-22-7i",
        reponse2: "-22+7i",
        reponse3: "22-7i",
        reponse4: "22+7i"
    },
     {
        type: "classico",
        question: "Une solution dans \\(\\mathbb{C}\\) de \\(z^{2}-4z+5=0\\) est :",
        bonneReponse: "2-i",
        reponse1: "2",
        reponse2: "-2+i",
        reponse3: "2-i",
        reponse4: "-2-i"
    },
     {
        type: "classico",
        question: "Si f(x)=\\((x-x^{2})4\\) alors f'(x)= ?",
        bonneReponse: "\\(4(-2x+1)(x-x^{2})^{3}\\)",
        reponse1: "\\(4(-2x+1)(x-x^{2})^{3}\\)",
        reponse2: "\\(4(x-x^{2})^{3}\\)",
        reponse3: "\\(-8x+4)",
        reponse4: "\\(-8x(x-x^{2})^{3}\\)"
    },
     {
        type: "classico",
        question: "Si f(x)=\\(sin^{2}(x)\\) alors f'(x)= ?",
        bonneReponse: "\\(2sin(x)cos(x)\\)",
        reponse1: "\\(2cos^{2}(x)\\)",
        reponse2: "\\(2sin(x)cos(x)\\)",
        reponse3: "\\(2sin(x)\\)",
        reponse4: "\\(2sin^{2}(x)\\)"
    },
     {
        type: "classico",
        question: "Soit f la fonction définie par f(x) = ln (x² −3x −4). Son ensemble de définition est :",
        bonneReponse: "\\(]-\\infty;-1[U]4;+\\infty[\\)",
        reponse1: "\\(]0;+\\infty[\\)",
        reponse2: "\\(\\mathbb{R}\\)",
        reponse3: "\\(]-\\infty;-1[U]4;+\\infty[\\)",
        reponse4: "\\(]0;4[\\)"
    },
     {
        type: "classico",
        question: "\\(4ln(2)-ln(8)+ln(4)\\)",
        bonneReponse: "\\(3ln(2)\\)",
        reponse1: "\\(ln(2)\\)",
        reponse2: "\\(-ln(2)\\)",
        reponse3: "\\(2ln(2)\\)",
        reponse4: "\\(3ln(2)\\)"
    },
     {
        type: "classico",
        question: "Le coefficient directeur de la tangente à la courbe représentative de la fonction f définie par \\(f(x)= 3ln(x^{2})+x^{2}\\) au point d’abscisse 2 est :",
        bonneReponse: "7",
        reponse1: "7",
        reponse2: "5",
        reponse3: "1",
        reponse4: "0"
    },
     {
        type: "classico",
        question: "Si une variable aléatoire X suit la loi normale N (1; 4) alors une valeur approchée au centième de \\(P(2\\:\\le\\:X\\:\\le\\:3)\\) est :",
        bonneReponse: "0.15",
        reponse1: "0.15",
        reponse2: "0.09",
        reponse3: "0.34",
        reponse4: "0.13"
    }
    ]

//on choisit une police "monospace" pour que le calcul de longueur des boutons n'ai pas de variance
repere.font = "20px monospace"

//fonction qui choisi la salle suivante aléatoirement
let aleaGen = function () {
    let choixSalleSuivante = Math.floor(7 * Math.random())
    return choixSalleSuivante
}

//détection du clic sur un des boutons
boutonVF1.addEventListener("click", function () {
    //on compare la réponse cliquée à la bonne réponse
    if (boiteQ[laQuestionChoisie2].bonneReponse == boiteQ[questionChoisie].reponse1) {
        bloque = false
        promptBon()
    } else {
        bloque = false
        promptMauvais()
    }

})

//----
boutonVF2.addEventListener("click", function () {
    if (boiteQ[laQuestionChoisie2].bonneReponse == boiteQ[questionChoisie].reponse2) {
        bloque = false
        promptBon()
    } else {
        bloque = false
        promptMauvais()
    }

})

//----
boutonVF3.addEventListener("click", function () {
    if (boiteQ[laQuestionChoisie2].bonneReponse == boiteQ[questionChoisie].reponse3) {
        bloque = false
        promptBon()
    } else {
        bloque = false
        promptMauvais()
    }

})

//----
boutonVF4.addEventListener("click", function () {
    if (boiteQ[laQuestionChoisie2].bonneReponse == boiteQ[questionChoisie].reponse4) {
        bloque = false
        promptBon()
    } else {
        bloque = false
        promptMauvais()
    }

})


function promptBon() {

    //on clear l'affichage du gandalf et de l'interface de questions
    repere.clearRect(0, 0, 800, 500)
    gandalfHTML.style.visibility = "hidden"
    carreBlanc.style.visibility = "hidden"
    boutonVF1.style.visibility = "hidden"
    boutonVF2.style.visibility = "hidden"
    boutonVF3.style.visibility = "hidden"
    boutonVF4.style.visibility = "hidden"
    //on récupère le numéro de la map choisie
    recupAlea = aleaGen()

    //on dessine l'image suivante
    repere.drawImage(choixActu[recupAlea], 0, 0)
    laby.src = choixActu[recupAlea].src
    laby2.src = `images/undermap${choixActuT[recupAlea]}.png`
    //ajout de point car c'est une bonne réponse
    nbrPoints++

    //on affiche le nouveau score
    repere.fillText("score : " + nbrPoints, 10, 20)
    repere.fillStyle = "#FFFFFF"

    //On efface ou fait appraître les boutons
    boutonGomme.style.visibility = "hidden"
    boutonCrayon.style.visibility = "hidden"
    feuille.style.display = 'none'
    feuille.style.border = 'hidden'
    bulleQuestion.style.visibility = 'hidden'

    //On affiche la nouvelle carte
    sprite.style.display = 'block'
    sprite.style.border = 'solid'
    repere.clearRect(0, 0, repere.canvas.width, repere.canvas.height)
    repere.drawImage(laby, 0, 0)
    repere.drawImage(perso, colonne + persoH, ligne + persoW, persoW, persoH, persoX, persoY, persoAfficheW, persoAfficheH)
}

function promptMauvais() {

    repere.clearRect(0, 0, 600, 600)
    gandalfHTML.style.visibility = "hidden"
    carreBlanc.style.visibility = "hidden"
    boutonVF1.style.visibility = "hidden"
    boutonVF2.style.visibility = "hidden"
    boutonVF3.style.visibility = "hidden"
    boutonVF4.style.visibility = "hidden"
    recupAlea = aleaGen()
    repere.drawImage(choixActu[recupAlea], 0, 0)
    laby.src = choixActu[recupAlea].src
    laby2.src = `images/undermap${choixActuT[recupAlea]}.png`
    repere.fillText("score : " + nbrPoints, 10, 20)
    repere.fillStyle = "#FFFFFF"
    boutonGomme.style.visibility = "hidden"
    boutonCrayon.style.visibility = "hidden"
    feuille.style.display = 'none'
    feuille.style.border = 'hidden'
    bulleQuestion.style.visibility = 'hidden'
    sprite.style.display = 'block'
    sprite.style.border = 'solid'
    repere.clearRect(0, 0, repere.canvas.width, repere.canvas.height)
    repere.drawImage(laby, 0, 0)
    repere.drawImage(perso, persoW, persoH, persoW, persoH, persoX, persoY, persoAfficheW, persoAfficheH)
}

//fonction de choix des question
function aleaQuestion() {

    let i = boiteQ.length

    //on choisi un chiffre de 0 à la taille de notre boite de question
    questionChoisie = Math.floor(i * Math.random())

    //fonction  pour choisir si on affiche 1 ou 2 boutons (V/F ou 4 réponses)
    if (boiteQ[questionChoisie].type == "VF") {
        //apparition des boutons que l'on a choisi
        boutonVF1.style.visibility = "visible"
        boutonVF2.style.visibility = "visible"

        //on prend les différentes réponses précisées dans l'objet et on l'écrit sur les boutons
        boutonVF1.innerHTML = boiteQ[questionChoisie].reponse1
        boutonVF2.innerHTML = boiteQ[questionChoisie].reponse2
    } else if (boiteQ[questionChoisie].type == "classico") {

        boutonVF1.innerHTML = boiteQ[questionChoisie].reponse1
        boutonVF2.innerHTML = boiteQ[questionChoisie].reponse2

        boutonVF3.innerHTML = boiteQ[questionChoisie].reponse3
        boutonVF4.innerHTML = boiteQ[questionChoisie].reponse4


        boutonVF1.style.visibility = "visible"
        boutonVF2.style.visibility = "visible"
        boutonVF3.style.visibility = "visible"
        boutonVF4.style.visibility = "visible"

    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, boutonVF1])
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, boutonVF2])
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, boutonVF3])
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, boutonVF4])
    //on renvoie questionChoisie
    return questionChoisie
}

/* Projet enfin fini, la CrewTeam vous remercie de votre compréhension
Clément Bonduelle
Thibaut Bourgeais
Thomas Dehee
Merci à notre maître illustre : DarkSathi */