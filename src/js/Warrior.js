class Warrior {
    constructor(breed, name, hp, strength) {
      this.breed = breed;
      this.name = name;
      this.hp = hp;
      this.strength = strength;
      this.itemPoints = 10
    }

    // Augmentation des points de vie (potions, bouclier)
    inscreaseHP(value){
      this.hp += value;
    }

    // Augmentation de la force (armes)
    increaseStrength(value){
      this.strength += value;
    }
  }