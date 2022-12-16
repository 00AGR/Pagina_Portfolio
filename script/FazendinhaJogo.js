var pincel = document.getElementById("canvas").getContext("2d");
var tela = document.querySelector('canvas');

//do Menu:
var fundoMenu = new Obj(0, 0, 8000, 800, "img/bg.png");
var titulo = new Obj(0, 0, 1200, 300, "img/MARCELINHOCATA.png");
var titulo2 = new Obj(390, 150, 400, 200, "img/OVOS.png");
var titulo3 = new Obj(0, 0, 1200, 300, "img/GameOver.png");
var buttonPlay = new Obj(400, 400, 400, 120, "img/ButtonUp1.png");
var buttonExit = new Obj(400, 550, 400, 120, "img/ButtonExit1.png");

//tutorial / cutscene
var Tutorial = new Obj(0, 0, 1200, 800, "img/TUTORIAL.png");
var CS1 = new Obj(0, 0, 1200, 800, "img/hist1.png");
var CS2 = new Obj(0, 0, 1200, 800, "img/hist2.png");
var buttonNext = new Obj(450, 700, 250, 80, "img/ProximoUP.png");
var buttonPlay2 = new Obj(400, 580, 400, 120, "img/ButtonUp1.png");

//do Game:
var bg = new BG(0, 0, 8000, 800, "img/bg.png");
var bg2 = new BG(8000, 0, 8000, 800, "img/bg.png");
var marcelinho = new Marcelinho(500, 600, 125, 150, "img/marcelinho6.png");
var cerca1 = new BG(1250, 665, 100, 80, "img/cerquinha.png");
var cerca2 = new BG(2050, 665, 100, 80, "img/cerquinha.png");
var caixa1 = new BG(1560, 665, 144, 110, "img/caixa.png");
var caixa2 = new BG(2260, 665, 144, 110, "img/caixa.png");
var placar = new Texto();
var galinhas = new Galinhas(-200, 580, 200, 200, "img/muitagalinha1.png");

//dos Sons
var musica = new Sounds("musics/CottonEyeJoe.mp3");
var chicken = new Sounds("musics/chickenSound.wav");
var jump = new Sounds("musics/jump.wav");
var damage = new Sounds("musics/damage.wav");

//Verificadores
var play = false;
var t1 = true;
var t2 = false;
var telaTut = false;
var h1 = false;
var h2 = false;
var verifica = false;

//função que verifica o clique nos botões através do evento do mouse
function mouse(event) {

    //a verificação ocorre analisando se a posição do clique está dentro da posição dos botões
    x = event.pageX - tela.offsetLeft;
    y = event.pageY - tela.offsetTop;

    if (play == false) {//se o level não estiver rodando
        
        if ((x > 400) && (x < 800) && (y > 400) && (y < 520)) { //posição do botão de jogar

            if(t2){
                ResetarOBJ(); //todos os objetos serão resetados
                play = true; //level rodando e o jogo começa
                t2 = false;
            }

            if(t1){
                h1 = true;
                t1 = false;
            }
        }

        if ((x > 400) && (x < 800) && (y > 550) && (y < 670)) { //posição do botão de sair

            if(t1 || t2){
                Exit(); //método que fecha a janela
            }
        }

        if ((x > 450) && (x < 700) && (y > 700) && (y < 780)) { //posição do botão de sair

            if(h2){
                telaTut = true;
                h2 = false;
            }

            if(h1){
                h2 = true;
                h1 = false;
            }
        }

        if ((x > 400) && (x < 800) && (y > 580) && (y < 700)) { //posição do botão de sair

            if(telaTut){
                ResetarOBJ(); //todos os objetos serão resetados
                play = true; //level rodando e o jogo começa
                telaTut = false;
            }
        }
    }
}

addEventListener("keydown", function (event) { //método que captura o evento de Input do teclado

    if (event.code === "Space" || event.key === "ArrowUp" || event.key === "w") { //o jogador pode pular pressionando Espaço, W ou ↑
        if(play){ //só pode pular (e tocar o som) caso esteja jogando
            jump.Play(true); //toca o som do pulo
            marcelinho.dirY = -1; //a direção para o pulo ocorrer (para cima)
        }
    }
    if (event.code === "Escape") { //caso o jogador pressione Esc, o jogo volta para o Menu Incial
        play = false;
        t2 = false;
        t1 = true;
    }
})

function ResetarOBJ() {

    //reseta todos os objetos do jogo em suas posições iniciais
    marcelinho.pontos = 0;
    marcelinho.x = 500;
    marcelinho.y = 600;

    bg.x = 0;
    bg2.x = 8000;

    cerca1.x = 1250;
    cerca2.x = 2050;
    caixa1.x = 1560;
    caixa2.x = 2260;
}

//função que "desenha"/imprime todos os objetos do menu 
function Menu() {

    fundoMenu.Draw();
    buttonPlay.Draw(); //botão de jogar
    buttonExit.Draw(); //botão de sair

    if (t1 == true) { //se estiver no menu inicial
        titulo.Draw(); 
        titulo2.Draw(); //imprimindo as imagens que compõe o título do jogo
    }

    if (t2 == true) { //se estiver no menu de gameOver
        titulo3.Draw(); //imprimir gameOver
    }

    if(h1){
        CS1.Draw();
        buttonNext.Draw(); //botão de sair
    }

    if(h2){
        CS2.Draw();
        buttonNext.Draw(); //botão de sair
    }

    if(telaTut){
        Tutorial.Draw();
        buttonPlay2.Draw();
    }
}

//"desenha"/imprime os objetos do level
function DrawGameObjects() {
    bg.Draw();
    bg2.Draw(); // bg e bg2 para o movimento do fundo

    cerca1.Draw();
    cerca2.Draw();
    caixa1.Draw();
    caixa2.Draw(); //obstáculos

    marcelinho.Draw();
    galinhas.Draw();
}

//toca as músicas de fundo 
function Sons(){
    if(play){//a música só toca no level e para de tocar (e reseta) nos menus
        musica.Play(true);
        chicken.Play(true);
    }else{
        musica.Play(false);
        chicken.Play(false);
    }
}

//função que executa o gameOver
function GameOver() {

    if(!t1 && !h1 && !h2 && !telaTut){//se não estiver no menu inicial
        if ( marcelinho.collide(galinhas)) { //se o marcelinho colidir com as galinhas
            play = false; //não estará mais jogando
            t2 = true;
            placar.draw("VOCÊ CORREU " + marcelinho.pontos + ' METROS', 460, 330); //imprimindo o placar no gameOver, abaixo do texto
        }
    }
}

function Exit() {
    javascript: window.close(); //método do javascript que fecha a janela
}

// função que verifica a ocorrência de colisões 
function collides() {

    if (marcelinho.collide(cerca1) || marcelinho.collide(cerca2) || marcelinho.collide(caixa1) || marcelinho.collide(caixa2)) { //se colidir com um obstáculo
        damage.Play(true); //toca o som de dano
        marcelinho.espera = true; //condição para ocorrer o efeito de dano
        marcelinho.Damage(marcelinho.x);//função onde ocorre o efeito de dano
    }
}

//função que faz a atualização dos objetos na cena -> como movimentações e animações
function Update() {

    bg.move(1.7, -8000, 0);
    bg2.move(1.7, 0, 8000); //movimentação do BG

    cerca1.move(1.7, -100, 1250);
    caixa1.move(1.7, -100, 1560);
    cerca2.move(1.7, -100, 2050);
    caixa2.move(1.7, -100, 2260); //movimentação dos obstáculos

    marcelinho.Animation("marcelinho", 6, 5);
    marcelinho.jump(); //movimentação e animação do Marcelinho

    marcelinho.score(); //função que calcula e imprime o Score

    galinhas.TempoGalinhasFunc(galinhas.x);
    galinhas.Animation( "muitagalinha", 4, 15); //movimentação e animação das galinhas
}

//função de controle da cena do jogo ->> verifica se o jogador está jogando ou no menu
function GameScene() {
    
    if (play == false) { //caso o jogador não esteja jogando, estará no menu, portanto a função do menu é chamada e nela ocorre a verificação de qual menu mostrar
        Menu();
    }

    if (play == true) { //caso o jogador esteja jogando, os objetos da cena devem ser desenhados e as colisões devem ocorrer, tal como as atualizações dos objetos da cena
        collides();
        DrawGameObjects();
        Update();

        placar.draw("score: " + marcelinho.pontos + 'm', 930, 60); //imprimindo o placar no canto superior direito da tela
    }
}

//função principal onde são chamadas as outras funções do jogo
function Main() {
    
    pincel.clearRect(0, 0, pincel.canvas.width, pincel.canvas.height); //limpa a tela
    GameScene();
    GameOver();
    Sons();
}

setInterval(Main, 1); //chama, a cada um milisegundo, a função principal onde ocorre toda a programação do jogo

tela.onclick = mouse; //capturando o evento do mouse
