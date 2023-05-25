
class HangGame{
    constructor(id){
        this.idContainer = id;      // id del contenedor
        this.diccionaryWords = diccionaryWords
        this.randomWord = [];       // palabra a adivinar
        this.wordSelected = "";
        
        this.gameOver = false;
        this.gameWon = false;

        this.wordsLabel;
        this.containerWordsLabel ;
        this.crono;

        this.guessed = 0;
        this.failed = 0;

        this.intervID;

        this.min;
        this.seg;

        this.arrLabels = [];

        this.score = "";

        this.status = ""
        
        this.ini();
    }

    ini(){
        
        let container = document.getElementById(this.idContainer);

        let containerHeading = document.createElement("div");
        containerHeading.style.display = "flex";
        containerHeading.style.flexDirection = "row";

        container.appendChild(containerHeading);



        // Estableciendo los elementos y estilos.
        this.colocateCrono(containerHeading);
        this.colocateScore(containerHeading);
        this.colocateWordsLabel();


        this.startingGame(); // començament del joc.

    }



    startingGame(){

        this.wordSelected = this.selectRandomWord();



        for (let i = 0; i < this.wordSelected.length; i++) {
            this.createLabelByWordLenght( this.wordsLabel, i);
        }

        this.randomWord = this.wordSelected.split("");
        // console.log(this.randomWord); // Descomentar para ver la palabra correcta

        // this.guessesLeft = 6;
        this.gameOver = false;
        this.gameWon = false;

        this.startCrono();  // Comienzo del crono

        this.colocateKeyboard();    // Colocar teclado

    }

    selectRandomWord(){
        let wordSelected = this.diccionaryWords[Math.floor(Math.random() * this.diccionaryWords.length)];

        return wordSelected;

    }

    createLabelByWordLenght( wordLabel, it){

        let charLabel = document.createElement('input');

        charLabel.setAttribute("class", "charLabel");
        charLabel.setAttribute("type", "text");
        charLabel.setAttribute('id', 'char_'+it);

        charLabel.style.width = "13px";
        charLabel.style.margin = "4px";
        // charLabel.style.height = "30px";

        wordLabel.appendChild(charLabel);
    }
    startCrono(){

        let min = 0;
        let seg = 0;

        let intervID = setInterval(() => {
            seg++;
            if(seg>60){
                min++;
                seg = 0;
            } 
            this.crono.textContent = min.toString().padStart(2,'0') + ":" + seg.toString().padStart(2,'0');

            this.min = min
            this.seg = seg

            let tempsFin = 45   // seleccionar el tiempo que se acaba
            let unitatSel = seg // seleccionar la unidad de tiempo que se acaba. (min, seg, horas, etc)

            if(unitatSel == tempsFin || (this.status == "win" && this.guessed == this.wordSelected.length) ){
                clearInterval(intervID);
                if(unitatSel == tempsFin ){
                    this.status = "lose";
                    this.showGameStatus(this.status);
                    this.bloquearTeclado();

                    this.arrLabels.forEach(label => {   // todos aquellos inputs que no disponen de backgroind-color, se les asigna el color rojo.
                        if(!label.getAttribute('style').includes("background-color")){
                            label.style.backgroundColor = "#ff5959";
                        }
                    });
                }
            }
        }, 1000);

        // this.intervID = intervID;

    }

    colocateKeyboard(){
        let charsWord = this.wordSelected.split("");
        let arrLabels = []

        for(let i = 0; i < this.wordSelected.length; i++){
            let label = document.getElementById('char_'+i);
            arrLabels.push(label);
        }
        let labFocus = 0;
        for (let i = 0; i < arrLabels.length; i++) {
            
            // console.log(arrLabels)
            // console.log(labFocus);
            this.arrLabels=arrLabels;

            arrLabels[i].addEventListener('keypress', (e) => {

                

                if(e.key.toUpperCase() == charsWord[i].toUpperCase()){  // No distingiré entre mayúsculas y minúsculas.
                    // console.log("correcto");
                    arrLabels[i].disabled = 'true';
                    arrLabels[i].value = e.key;
                    arrLabels[i].style.backgroundColor = "#00FF60";
                    

                    if(i < arrLabels.length - 1){

                        if(arrLabels[labFocus+1] == undefined){
                            // console.log("se acabo");
                            this.status = "win";
                            this.showGameStatus(this.status);

                            // arrLabels[labFocus-1].focus();
                        }else{
                            // let seleccionActual = arrLabels[i].getAttribute('id').split('_')[1]
                            arrLabels[labFocus+1].focus();
                            arrLabels[labFocus+1].textContent = "";
                            
                        }
                    }
                    this.guessed++;
                    labFocus++;

                    if(i == arrLabels.length-1 && this.guessed == this.wordSelected.length ){
                        this.status = "win";
                        this.showGameStatus(this.status);
                    }
                    
                }else{
                    arrLabels[i].style.backgroundColor = "#ff5959";

                    this.failed++;
                    
                    e.preventDefault();
                }

                this.score.innerText = "Errors: "+this.failed+" \n Encerts : "+this.guessed;
            });
            
        }
    }

    bloquearTeclado(){
        // console.log("label bloqueado");
        let arrLabels = document.getElementsByClassName("charLabel");
        for (let i = 0; i < arrLabels.length; i++) {
            arrLabels[i].disabled = "true";
        }
    }

    showGameStatus(status){
        let message = document.createElement("div");
        message.setAttribute("class", "containerWordsLabel");

        message.style.fontSize = "15px";
        message.style.order = '1';
        message.style.textAlign = "center";

        let containerPrinWordsLabel = document.getElementsByClassName("containerPrincWordLabel")[0];

        containerPrinWordsLabel.style.background = "#02FEE3";
        containerPrinWordsLabel.style.display = "grid";

        // message
        if(status == 'win'){
            message.innerText = "You win!";
            message.style.color = "green";
            
            containerPrinWordsLabel.appendChild(message);
            
        }else if(status == 'lose'){
        
            message.innerText = "You lose!";
            message.style.color = "red";

            containerPrinWordsLabel.appendChild(message);
        }

        // boton restart
        let restart = document.createElement("button");
        restart.setAttribute("id", "restart");
        restart.setAttribute("onclick", "location.reload()");
        restart.innerText = "Reiniciar";

        restart.style.margin = "20px 70px 0px 70px";
        restart.style.order = "2";

        containerPrinWordsLabel.style.textAlign = "center";
        containerPrinWordsLabel.appendChild(restart);
    }

    colocateCrono(header){

        let container = document.getElementById(this.idContainer);

        let crono = document.createElement("div");
        crono.setAttribute("id", "crono");
        crono.setAttribute("class", "crono");
        crono.innerText = "00:00";
        crono.style.width = "3rem";
        crono.style.background = "#BC6CEC";
        crono.style.padding = "30px";

        this.crono = crono;

        header.appendChild(crono);
    }

    colocateScore(header){
    
        let container = document.getElementById(this.idContainer);

        let score = document.createElement("div");
        score.setAttribute("id", "score");
        score.setAttribute("class", "score");
        score.innerText = "Errors: "+this.failed+" \n Encerts : "+this.guessed;

        
        score.style.flex = "auto";
        score.style.padding = "20px"
        score.style.background = "#02FEE3"
        
        this.score = score;

        header.appendChild(score);
    }

    colocateWordsLabel(){
        
        let container = document.getElementById(this.idContainer);
        // container.style.diplay="flex";

        let containerWordLabel = document.createElement("div"); 

        let wordsLabel = document.createElement("div");

        wordsLabel.setAttribute("id", "wordsLabel");
        wordsLabel.setAttribute("class", "wordsLabel");

        wordsLabel.style.padding = "70px";
        wordsLabel.style.background = "#02FEE3";
        wordsLabel.style.marginBottom = "0";
        wordsLabel.style.order = "3";

        container.appendChild(containerWordLabel);
        containerWordLabel.setAttribute('class','containerPrincWordLabel');

        containerWordLabel.appendChild(wordsLabel);

        container.style.textAlign = "center";

        this.wordsLabel = wordsLabel;

        this.containerWordsLabel = containerWordLabel;

    }
}