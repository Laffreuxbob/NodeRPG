class Elf extends Warrior{
    constructor(name){
        super(name);
        this.breed = "Elf"
        this.dodgingChance = .05;
        this.dealPoison = false;
    }
    
    dealPoison(human){
        if(this.dealPoison){
            human.poisonState = 3;
        }
    }
    
    attack(warrior){
        warrior.hp -= this.strength;
        if (warrior instanceof Human){
            this.dealPoison(warrior)
        }
    }
    
    useWeapon(weapon){
        if(weapon.type === "dagger"){
            this.dealPoison = true;
        }
        if(weapon.type === "staff"){
            this.strength += weapon.addStrength;
        }
    }
}