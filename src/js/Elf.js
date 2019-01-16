class Elf extends Soldier{
    constructor(breed, name, hp, strength, itemPoints){
        super(breed, name, hp, strength, itemPoints);
        this.dodgingChance = .05;
    }
}