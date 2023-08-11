//DEFINITION DES VARIABLES GLOBALES
const MUR = "m";
const MONSTRE = "M";
const JOUEUR = "J";
const TRESOR = "T";
const SOL = "";
const grilleTableBody = document.getElementById('grilleBody');
//Classe Game
class Game {
    //Construction de la grille pour jouer
    constructor(lignes, colones, nbMonstres, nbTresors) {
        //Initialisation des parametres par les valeurs entrees
        this.grille = [];
        this.score = 0;
        this.lignes = lignes;
        this.colones = colones;
        this.nbMonstres = nbMonstres;
        this.nbTresors = nbTresors;
        this.vie = 3;
        this.niveau = 1;

        this.initialiserGrille();// Methode -I
        this.placerElements();// Methode -II
        this.addEventListeners();// Methode -III
        this.updategrille();// Methode -IV
    }
    //I-Methode pour generer une grille dont tous les elements sont des SOL
    initialiserGrille() {
        for (let i = 0; i < this.lignes; i++) {
            this.grille.push(new Array(this.colones).fill(SOL));
        }
        document.getElementById('niveau').textContent = this.niveau;
        document.getElementById('vie').textContent = this.vie;
    }
    //II-Methode pour placer le joueur, les monstres et les tresors dans la grille dans facon aleatoire
    placerElements() {
        //placer le joueur 
        this.placerElementAleatoire(JOUEUR); // Methode II-1
        //placer tous les monstres
        for (let i = 0; i < this.nbMonstres; i++) {
            this.placerElementAleatoire(MONSTRE);
        }
        //placer tous les tresors
        for (let i = 0; i < this.nbTresors; i++) {
            this.placerElementAleatoire(TRESOR);
        }
        //placer les murs
        for (let i = 0; i < this.lignes; i++) {
            for (let j = 0; j < this.colones; j++) {
                //verifier si la position est vide avant de placer le mur . Les murs presentent 30 % de la grille
                if (Math.random() < 0.3 && this.grille[i][j] === SOL &&
                    !this.procheDuJoueurOuMonstres(i, j) && // METHODE a
                    !this.procheDesTresors(i, j)) { // Methode b
                    this.grille[i][j] = MUR;
                }
            }
        }
    }
       //   a--Methode pour verifier si la position est proche d'un joueur ou d'un monstre , elle retourne true or false
    procheDuJoueurOuMonstres(ligne, colone) {
        //Trouver les emplacements du joueur et des monstres
        const emplacementJoueur = this.trouverEmplacement(JOUEUR);
        const MonstresPositions = this.trouverEmplacements(MONSTRE);
        // Verifier si la position est ptoche du joueur ou d'un monstre
        if (this.distance(emplacementJoueur.L, emplacementJoueur.C, ligne, colone) <= 2 || MonstresPositions.some(position => this.distance(position.L, position.C, ligne, colone) <= 2)) {
            return true;
        }
        return false;
    }
    // b--- Methode pour verifier si la position est proche des tresores , elle retourne true or false
    procheDesTresors(ligne, colone) {
        //Trouver les emplacements des tresors
        const tresorsPositions = this.trouverEmplacements(TRESOR);
        // Verifier si la position est proche des tresors
        if (tresorsPositions.some(position => this.distance(position.L, position.C, ligne, colone) <= 2)) {
            return true;
        }
        return false;
    }
    // c--- Methode pour calculer la distance entre deux positions
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
    //II-1 Methode pour mettre en position aleatoire un element passé en parametre
    placerElementAleatoire(element) {
        while (true) {
            //generer une position aleatoire 0<=ligne<lignes et 0<=colone<colones
            const ligne = Math.floor(Math.random() * this.lignes);
            const colone = Math.floor(Math.random() * this.colones);
            // verifier si la position est vide pour placer l'element
            if (this.grille[ligne][colone] === SOL) {
                this.grille[ligne][colone] = element;
                return;
            }
        }
    }

    //III Methode pour ajouter des lesteners
    addEventListeners() {
        //III-1 Quand toucher le clavier , activer l'utilisation des directions du clavier pour juouer 
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.deplacerJoueur("up"); // Methode A pour deplacer le Joueur
                    break;
                case "ArrowDown":
                    this.deplacerJoueur("down");
                    break;
                case "ArrowLeft":
                    this.deplacerJoueur("left");
                    break;
                case "ArrowRight":
                    this.deplacerJoueur("right");
                    break;
            }
        });
        // III-2 Activer l'utilisation des boutons definis en HTML pour se deplacer
        // Stockage des références aux éléments HTML
        let Up = document.getElementById('up');
        let Down = document.getElementById('down');
        let Left = document.getElementById('left');
        let Right = document.getElementById('right');
        // Appel des listeners
        Down.addEventListener("click", () => this.deplacerJoueur('down'));
        Up.addEventListener("click", () => this.deplacerJoueur('up'));
        Right.addEventListener("click", () => this.deplacerJoueur('right'));
        Left.addEventListener("click", () => this.deplacerJoueur('left'));
        // IV-3 Bouton reinitialiser
        let reinitialiser=document.getElementById("Reinitialiser");
        reinitialiser.addEventListener("click",()=> this.rejouerDesDebut());
    }
    // A--- Methode pour deplacer le joueur
    deplacerJoueur(direction) {
        //Trouver l'emplacement actuel du joueur
        const emplacementJoueur = this.trouverEmplacement(JOUEUR);
        //Definir la nouvelle position selon la direction choisie
        const nouvelleLigne = emplacementJoueur.L + (direction === "up" ? -1 : direction === "down" ? 1 : 0);
        const nouvelleColone = emplacementJoueur.C + (direction === "left" ? -1 : direction === "right" ? 1 : 0);
        //Verifier la faisabilite et deplacer un element
        if (this.verifierEmplacement(nouvelleLigne, nouvelleColone)) {
            const elementNouvelEmplacement = this.grille[nouvelleLigne][nouvelleColone];
            //Augmenter le score si le nouvel emplacement contient un tresor
            if (elementNouvelEmplacement === TRESOR) {
                this.score++;
                let scoreTotal = parseInt(document.getElementById('score').textContent) + 1;
                document.getElementById('score').textContent = scoreTotal;
            }
            //Finir la partie si le nouvel emplacement contient un monstre
            if (elementNouvelEmplacement === MONSTRE) {
                this.gameOver();
                return;
            }
            //Mettre a jour la position , deplacer les monstres et mettre a jour la grille
            this.updatePosition(emplacementJoueur.L, emplacementJoueur.C, nouvelleLigne, nouvelleColone, JOUEUR);
            this.deplacerMonstres();
            this.updategrille();
            //Feliciter le joueur s'il ramasse tous les tresors
            if (this.score === this.nbTresors) {
                this.gameOver(true);
            }
        }
    }
    //----- B Methode pour deplacer les monstres
    deplacerMonstres() {
        //Trouver les emplacements des monstres
        const MonstresPositions = this.trouverEmplacements(MONSTRE);
        //Definir des nouvelles positions
        for (const position of MonstresPositions) {
            const nouvelleLigne = position.L;
            const nouvelleColone = position.C + (Math.random() < 0.5 ? -1 : 1);
            //Verifier la faisabilite et deplacer les monstres
            if (this.verifierEmplacement(nouvelleLigne, nouvelleColone) && this.grille[nouvelleLigne][nouvelleColone] != JOUEUR
                && this.grille[nouvelleLigne][nouvelleColone] != TRESOR) {
                this.updatePosition(position.L, position.C, nouvelleLigne, nouvelleColone, MONSTRE);
            }
        }
    }
    // Verifier un emplacement et determiner si le deplacement et faisable ou non
    verifierEmplacement(ligne, colone) {
        return ligne >= 0 && ligne < this.lignes && colone >= 0 && colone < this.colones && this.grille[ligne][colone] != MUR;
    }
    //Chercher l'emplacement d'un element de la grille
    trouverEmplacement(element) {
        for (let ligne = 0; ligne < this.lignes; ligne++) {
            for (let colone = 0; colone < this.colones; colone++) {
                if (this.grille[ligne][colone] === element) {
                    return { L: ligne, C: colone };
                }
            }
        }
        return null;
    }
    //Chercher l'emplacement de plusieurs elements du meme type dans la grille
    trouverEmplacements(element) {
        const positions = [];
        for (let ligne = 0; ligne < this.lignes; ligne++) {
            for (let colone = 0; colone < this.colones; colone++) {
                if (this.grille[ligne][colone] === element) {
                    positions.push({ L: ligne, C: colone });
                }
            }
        }
        return positions;
    }
    //Mise a jour de la position
    updatePosition(ancienneLigne, ancienneColone, nouvelleLigne, nouvelleColone, element) {
        this.grille[nouvelleLigne][nouvelleColone] = element;
        this.grille[ancienneLigne][ancienneColone] = SOL;
    }


    //IV- Affichage de lagrille dans la page web
    updategrille() {
        // supprimer tous les elements de la table HTML
        grilleTableBody.innerHTML = '';
        // creer les lignes et les colones dans la table HTML et donner au cellules les valeurs de la grille
        for (let i = 0; i < this.lignes; i++) {
            // creer les lignes tr
            const tableligne = document.createElement('tr');
            // creer les cellules td
            for (let j = 0; j < this.colones; j++) {
                const tableCellule = document.createElement('td');
                // remplir les cellules par les elements de la grille , leur donner des ID et des nom de classe
                const valeurCellule = this.grille[i][j];

                tableCellule.innerText = valeurCellule;
                tableCellule.className = this.getClassName(valeurCellule);
                tableCellule.id = `cell-${i}-${j}`;
                // Mettre les cellules dans les lignes
                tableligne.appendChild(tableCellule);
            }
            //Mettre les lignes dans la table HTML
            grilleTableBody.appendChild(tableligne);
        }
    }
    // IV-1 Methode pour definir les classes selon l'elt passé en parametre
    getClassName(element) {
        switch (element) {
            case MUR: return 'mur';
            case MONSTRE: return 'monstre';
            case JOUEUR: return 'joueur';
            case TRESOR: return 'tresor';
            default: return 'sol';
        }
    }
    // Methode pour demarrer le jeu
    startGame() {
        this.updategrille();
    }
    //Methode pour rejouer
    rejouer() {
        this.score = 0;
        this.grille = [];
        this.initialiserGrille();
        this.placerElements();
        this.updategrille();
    }
    rejouerDesDebut() {
        this.vie = 3;
        this.niveau = 1;
        this.nbMonstres = 4;
        this.nbTresors = 4;
        document.getElementById('score').textContent = 0;
        this.rejouer();
    }
    // Methode gameover : perte/victoire
    gameOver(gagner = false) {
        if (gagner) {
            alert(`Félicitations ! Vous avez collecté tous les trésors !\nScore Total : ${document.getElementById('score').textContent}`);
            if (confirm("Passons au niveau suivant")) {
                this.niveau++;
                this.nbMonstres++;
                this.nbTresors++;
                this.rejouer();
            } else {
                window.close();
            }
        } else {
            this.vie--;
            if (this.vie === 0) {
                alert(`Vous avez perdu. Votre score final : ${document.getElementById('score').textContent}`);
                if (confirm("Voulez-vous rejouer ?")) {
                    this.rejouerDesDebut();
                } else {
                    window.close();
                }
            } else {
                alert(`Il vous reste ${this.vie} tentatives.`);
                this.rejouer();
            }
        }
    }


}

///////----------Demarrer le Jeu ------------------------------////
let game = new Game(15, 20, 4, 4);
game.startGame();