class Elf extends Soldier{
    constructor(breed, name, hp, strength, itemPoints, dodgingChance){
        super(breed, name, hp, strength, itemPoints);
        this.dodgingChance = dodgingChance;
    }
}