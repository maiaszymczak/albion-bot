import { compositions } from './src/data/albion-data.js';
import { formatCompositionEmbed } from './src/utils/composition-generator.js';

const template = compositions['corrupted_dungeon'];

console.log('=== Test Donjon Corrompu ===\n');
console.log('Has preset?', !!template.preset);
console.log('Preset length:', template.preset?.length);
console.log('Size:', template.size);

if (template.preset) {
  const embed = formatCompositionEmbed(template, template.preset);
  
  console.log('\n=== Embed Discord ===');
  console.log('Title:', embed.title);
  console.log('Description:', embed.description);
  console.log('Fields count:', embed.fields.length);
  console.log('\nPremiers 3 builds:');
  embed.fields.slice(0, 3).forEach(field => {
    console.log(`\n${field.name}`);
    console.log(field.value);
  });
} else {
  console.log('❌ Pas de preset trouvé !');
}
