class Warrior {
    constructor(breed, name) {
      this.breed = breed;
      this.name = name;
      this.hp = 200;
      this.strength = 20;
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