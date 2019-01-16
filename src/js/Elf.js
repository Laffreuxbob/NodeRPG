class Elf extends Warrior{
    constructor(breed, name, hp, strength, itemPoints){
        super(name, hp, strength, itemPoints);
        this.breed = "Elf"
        this.dodgingChance = .05;
    }

    dealPoison(human){
        human.poisonState = 3;
    }

    attack(warrior){
        warrior.hp -= this.strength;
        if (warrior instanceof Human){
            this.dealPoison(warrior)
        }
    }
}