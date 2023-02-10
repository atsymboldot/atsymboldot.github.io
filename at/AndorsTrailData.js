class AndorsTrailData {
    async initialize(url) {
        this.data = await fetch(url).then(r => r.json());
        this.normalizeData();
        this.pruneData();
    }

    getMonsters() {
        return this.data.monsterlist.filter(m => m.attackDamage.max > 0);
    }

    getNpcs() {
        return this.data.monsterlist.filter(m => m.attackDamage.max == 0);
    }

    getItems() {
        return this.data.itemlist;
    }

    normalizeData() {
        if (this.data.monsterlist) {
            const monsters = this.data.monsterlist;
            for (let m of this.data.monsterlist) {
                if (!m.attackChance) m.attackChance = 0;
                if (!m.criticalSkill) m.criticalSkill = 0;
                if (!m.criticalMultiplier) m.criticalMultiplier = 0;
                if (!m.blockChance) m.blockChance = 0;
                if (!m.damageResistance) m.damageResistance = 0;
                if (!m.attackDamage) m.attackDamage = { min: 0, max: 0 };
                if (!m.maxHP) m.maxHP = 1;
                if (!m.maxAP) m.maxAP = 10;
                if (!m.attackCost) m.attackCost = 10;
                if (!m.moveCost) m.moveCost = 10;
                if (!m.movementAggressionType) m.movementAggressionType = 'none';
                if (!m.unique) m.unique = 0;
            }
        }
    }

    pruneData() {
        this.data.monsterlist = this.data.monsterlist.filter(m => m.damageResistance < 100);
    }
}

export { AndorsTrailData };