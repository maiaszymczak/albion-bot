// Test d'extraction des membres depuis un embed

const testField = {
  name: "1. Tank",
  value: "🛡️ **Masse Incube**\n📋 Rôle: Frontline/CC\n🎽 Équipement:\nMandebrume + Capuche Assassin + Armure Gardien + Sandales Culte + Bridgewatch + Omelette T7"
};

console.log("=== TEST EXTRACTION ===");
console.log("Field name:", testField.name);
console.log("Field value:", testField.value);
console.log("");

// Test du regex pour le type de rôle
const roleTypeMatch = testField.name.match(/\d+\.\s*(\w+)/);
console.log("Role type match:", roleTypeMatch);
if (roleTypeMatch) {
  console.log("Role type extracted:", roleTypeMatch[1]);
}

// Test du regex pour l'arme
const firstLine = testField.value.split('\n')[0];
console.log("\nFirst line:", firstLine);
console.log("First line charCodes:", Array.from(firstLine).map(c => c.charCodeAt(0)));

const weaponMatch = firstLine.match(/[🛡️⚔️💚🏹🔥⚡🗡️🪓🏹]\s*\*\*(.+?)\*\*/);
console.log("Weapon match:", weaponMatch);
if (weaponMatch) {
  console.log("Weapon extracted:", weaponMatch[1]);
}

// Test alternatif : chercher tout ce qui est entre **
const altMatch = firstLine.match(/\*\*(.+?)\*\*/);
console.log("\nAlternative match (any text in **):", altMatch);
if (altMatch) {
  console.log("Alternative extracted:", altMatch[1]);
}
