class Human extends Soldier{
    constructor(name, hp, strength, itemPoints, poisonState, healingItem){
        super(name, hp, strength, itemPoints);
        this.breed = "Human"
        this.poisonState = poisonState;
        this.healingItem = 0;
    }

    // Si empoisonné, perds x hp sur y tours
    dotPoison(){
        if(this.poisonState >= 0){
            this.hp -= 5;
            this.poisonState -= 1;
        }
    }

    // L'humain attaque, si la cible est un elf il a une chance d'esquive
    attack(warrior){
        if(warrior instanceof Elf){
            let dodge = Math.random();
            if(dodge > warrior.dodgingChance){
                warrior.hp -= this.strength;
            }
        }else{
            warrior.hp -= this.strength;
        }
    }

    // Ajouter des potions a la création de l'Humain
    getPotions(value){
        this.healingItem += value;
        this.itemPoints -= value;
    }

    // Utiliser une potion, si disponible, en combat
    usePotion(){
        if(this.healingItem > 0){
            this.healingItem -= 1;
            this.hp += 10;
        }
    }
}