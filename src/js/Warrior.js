class Warrior {
    constructor(breed, name, user) {
      this.breed = breed;
      this.name = name;
      this.hp = 200;
      this.strength = 20;
      this.itemPoints = 10
      this.user = user || "bob"
    }

    // Augmentation des points de vie (potions, bouclier)
    inscreaseHP(value){
      this.hp += value;
    }

    // Augmentation de la force (armes)
    increaseStrength(value){
      this.strength += value;
    }
  };

  module.exports = Warrior

