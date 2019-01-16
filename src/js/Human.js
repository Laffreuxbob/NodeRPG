class Human extends Soldier{
    constructor(breed, name, hp, strength, itemPoints, poisonState){
        super(breed, name, hp, strength, itemPoints);
        this.poisonState = poisonState
    }
}