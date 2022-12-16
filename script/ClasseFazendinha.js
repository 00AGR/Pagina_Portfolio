class Obj {

    //das animações
    frame = 1; 
    timer = 0;

    constructor(x, y, width, height, img) { //método construtor comum em todos os objetos contendo -> x e y, altura e largura (dos sprites) e o caminho para fonte da imagem (sprite)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
    }

    Draw() { //método que desenha objetos em cena de acordo com seus respectivos sprites, posições e tamanhos
        var image = new Image();
        image.src = this.img;
        pincel.drawImage(image, this.x, this.y, this.width, this.height);

    }

    //método que executa as animações, consiste na troca de sprites decorrido determinado tempo
    Animation(name, Tframes, speed) { //como parâmetros: o nome que aparecerá nas imagens(o nome deve ser o mesmo para todas as imagens seguidos de uma numeração de 1 ao número da última imagem)
        //Tframes corresponde à quantidade de frames, ou seja, imagens, totais da animação
        //já speed corresponde à velocidade em que ocorrerão as trocas de imagens

        this.timer += 1; //incrementando o timer (lembrando que isso ocorre devido ao setInterval, 
        //e que essa variável está sendo incrementada a cada vez que o setInterval é chamado, neste caso, a cada um milisegundo)

        if (this.timer > speed) { //se tiver sido decorrido o tempo previamente definido
            this.timer = 0; //o timer é zerado
            this.frame += 1; //a numeração da imagem é incrementada em uma unidade
        }

        if (this.frame > Tframes) { //quando a animação chegar na última imagem, esta será resetada para a primeira imagem
            this.frame = 1;
        }

        this.img = "img/" + name + this.frame + ".png"; //mudando a fonte da imagem que está sendo impressa ultilizando o nome padrão de todas as imagens da animação, e sua numeração (frame)
    }
}

class BG extends Obj { //a classe do BG(BackGround) é uma extensão da classe dos Objetos(Obj)
    //pos é a posição inicial padrão
    move(speed, limit, pos) { //a movimentação do BG ocorre com base na alteração da posição do objeto de acordo com uma determinada velocidade, quando a posição alcança o limite, ela é resetada
        this.x -= speed; //a velocidade nesse caso corresponde à quantidade de unidades decrementadas da posição em x, nesse caso para a esquerda
        
        if (this.x < limit) {//como a posição está sendo decrementada, é preciso verificar se a posição é menor que o limite, ou seja, está anterior(à esquerda) da posição limite
            this.x = pos; //posição resetada
        }
    }
}

class Marcelinho extends Obj {

    //do pulo
    dirY = 0;
    jumpForce = 5;
    gravity = 1;
    tempinhoPulo = 10;

    //do score
    pontos = 0;
    tempoScore = 23;

    //do dano pela colisão com obstáculos
    espera = false;
    tempoDano = 0;

    jump() { //método do pulo

        if (this.dirY != 0) { //se a direção do pulo for diferente de 0, ou seja, o jogador tenha pressionado para pular

            this.y += this.jumpForce * this.dirY; //a posição do personagem será incrementada em y pela força do pulo em determinada direção (como é um pulo, será -1, pois ele deverá subir/ir para cima)
            //a força corresponde à quantidade de unidades sendo incrementadas

            if (this.tempinhoPulo > 0) {
                this.tempinhoPulo--;
            }//timer sendo executado

            if (this.tempinhoPulo <= 0) {
                this.jumpForce -= this.gravity;
                this.tempinhoPulo = 15;
            }//cada vez que o Timer zera (a cada 15 milisegundos), a força do pulo é reduzida pelo valor da gravidade, isso faz com que o personagem passe a cair (pela força da gravidade)
            //enquanto o personagem não alcançar o chão, o timer é resetado ao zerar

            if (this.y >= 600) { //se o personagem alcançar o chão
                this.dirY = 0; //a direção do pulo é zerada, o personagem para de pular
                this.jumpForce = 5; //o valor da força é restaurado ao seu valor original
                this.tempinhoPulo = 10; //o tempo é resetado para 10 milisegundos, é o tempo que o personagem terá para subir até seu ponto máximo
                this.y = 600; //a posição em que o personagem toca o chão
            }
        }
    }

    collide(obj) { //função que verifica colisão, leva como parâmetro o objeto com o qual está ocorrendo a verificação

        //se a posição do marcelinho corresponder à posição do objeto em questão (os tamanhos dos objetos são levados em questão, como área que ele ocupa)
                    //(um objeto invadir a área ocupada por outro objeto)
        if ((this.x + 50) < obj.x + obj.width && this.x + (this.width - 50) > obj.x && this.y < obj.y + obj.height && this.y + this.height > obj.y) {
            return true; //retorno verdadeiro indica ocorrência da colisão
        } else {
            return false; //não houve colisão
        }
    }

    score() {

        this.tempoScore--; //a pontuação também tem seu próprio timer
        if (this.tempoScore == 0) { //se esse timer chegar a zero, a pontuação é incrementada
            this.pontos++;
            this.tempoScore = 23; //valor do tempo é resetado
        }
    }

    Damage(x){ //leva em consideração o x do objeto

        //se marcelinho colidiu com um objeto, ele receberá um atraso/será empurrado em sua movimentação enquanto estiver ativo um contador que quando chega em 200 milisegundos, 
        //é resetado e marcelinho para de ser empurrado

        if(this.espera){
            this.tempoDano ++;
            x = this.x--;
        }
        if(this.tempoDano >= 200){
            this.tempoDano = 0;
            this.espera = false;
        }
    }
}

class Texto {
    
    //método para impressão de texto na tela, leva como parâmetro o texto (string) e a posição (x e y)
    draw(texto, x, y) {
        pincel.font = "30px impact";
        pincel.fillStyle = "#472C0A";
        pincel.fillText(texto, x, y);
    }
}

class Galinhas extends Obj{

    tempoGalinhas1 = 4;
    tempoGalinhas2 = 0; //a galinha utiliza dois timers em sua movimentação, o primeiro é para atualizar sua posição na movimentação e o segundo é para alterar a direção do movimento
    //a galinha começa fora da tela e corre até alcançar sua posição máxima, e então fica para trás e depois corre para alcançar a posição máxima novamente, repeditamente
    dir = 1; //para controlar a direção em que ela se move

    TempoGalinhasFunc(x){

        if(this.tempoGalinhas1 > 0){
            this.tempoGalinhas1 --;
        }//timer decrementando

        if(this.tempoGalinhas1 == 0){
            this.ChangePosChic(x);
            this.tempoGalinhas1  = 4;
        }//quando ele chega a zero, a movimentação ocorre (através de um método próprio) e o timer é resetado
    }

    ChangePosChic(x){//atualiza a posição da galinha ->> movimentação

        if(this.tempoGalinhas2 > 0){
            this.tempoGalinhas2 --;
        }//timer que altera a direção do movimento

        if(this.tempoGalinhas2 == 0){ //enquanto o segundo contador estiver zerado, as galinhas podem se mover

            if(this.dir==1){ //se a galinha estiver indo para frente
                if(this.x < 50){ //e não tiver alcançado o limite de posição
                    x = this.x++; //ela irá se movimentar uma unidade para frente
                }
                else{ //se ela tiver alcançado o limite
                    x = 50; //sua posição se mantém estável em 50px
                    this.tempoGalinhas2  = 60; //o contador para alterar a direção inicia
                }
            }

            if(this.dir == -1){ //se a galinha estiver indo para trás

                if(this.x > -15){ //e não tiver alcançado o limite de posição
                    x = this.x--; //ela irá se movimentar uma unidade para trás
                }
                else{ //se ela tiver alcançado o limite
                    x = -15;  //sua posição se mantém estável em -15px
                    this.tempoGalinhas2  = 60; //o contador para alterar a direção inicia
                }
            }

            //se tiver alcançado o limite de posição, a direção inverte

            if(x == 50){
                this.dir = -1;
            }else if(x == -15){
                this.dir = 1;
            }
        }
    }
}

//classe dos sons do jogo
class Sounds{

    audio = new Audio(); //instanciando novo audio

    constructor(source) { //encontrando o audio nos arquivos do jogo utilizando o caminho para a fonte passado como parâmetro na criação de um novo objeto
        this.audio.src = source
    }

    Play(doPlay){
        if(doPlay){
        this.audio.play(); //se ele deve tocar (doPlay for verdadeiro), ele irá tocar o audio
        }
        if(!doPlay){ //caso contrário, o audio será pausado e em seguida reiniciado
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}