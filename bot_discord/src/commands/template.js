import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { persistence } from '../utils/persistence.js';

export const data = new SlashCommandBuilder()
  .setName('template')
  .setDescription('Gestion des templates de compositions')
  .addSubcommand(subcommand =>
    subcommand
      .setName('save')
      .setDescription('Sauvegarder la dernière composition créée')
      .addStringOption(option =>
        option
          .setName('nom')
          .setDescription('Nom du template')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('load')
      .setDescription('Charger un template sauvegardé')
      .addStringOption(option =>
        option
          .setName('nom')
          .setDescription('Nom du template à charger')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Liste vos templates sauvegardés')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Supprimer un template')
      .addStringOption(option =>
        option
          .setName('nom')
          .setDescription('Nom du template à supprimer')
          .setRequired(true)
          .setAutocomplete(true)
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  if (subcommand === 'save') {
    const templateName = interaction.options.getString('nom');

    // Récupérer le dernier message de l'utilisateur dans le canal
    const messages = await interaction.channel.messages.fetch({ limit: 50 });
    let lastCompo = null;

    for (const msg of messages.values()) {
      if (msg.interaction?.user.id === userId && 
          msg.embeds.length > 0 && 
          msg.embeds[0].title?.includes('Composition')) {
        lastCompo = msg.embeds[0];
        break;
      }
    }

    if (!lastCompo) {
      await interaction.reply({
        content: '❌ Aucune composition récente trouvée. Créez d\'abord une composition avec `/compo`.',
        ephemeral: true
      });
      return;
    }

    // Extraire la composition depuis l'embed
    const composition = {
      name: lastCompo.title,
      description: lastCompo.description,
      fields: lastCompo.fields,
      color: lastCompo.color
    };

    await persistence.saveUserTemplate(userId, templateName, composition);

    await interaction.reply({
      content: `✅ Template **${templateName}** sauvegardé avec succès !`,
      ephemeral: true
    });
  }

  if (subcommand === 'load') {
    const templateName = interaction.options.getString('nom');
    const templates = await persistence.getUserTemplates(userId);

    if (!templates[templateName]) {
      await interaction.reply({
        content: `❌ Template **${templateName}** introuvable.`,
        ephemeral: true
      });
      return;
    }

    const template = templates[templateName];
    const embed = new EmbedBuilder()
      .setColor(template.composition.color || 0x3498db)
      .setTitle(template.composition.name)
      .setDescription(template.composition.description)
      .setFields(template.composition.fields)
      .setFooter({ text: `Template: ${templateName}` })
      .setTimestamp();

    const signupButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('open_signup')
          .setLabel('📋 Ouvrir les inscriptions')
          .setStyle(ButtonStyle.Success)
      );

    await interaction.reply({ embeds: [embed], components: [signupButton] });
  }

  if (subcommand === 'list') {
    const templates = await persistence.getUserTemplates(userId);
    const templateNames = Object.keys(templates);

    if (templateNames.length === 0) {
      await interaction.reply({
        content: '📝 Vous n\'avez pas encore de templates sauvegardés.',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('📝 Vos templates')
      .setDescription(`${templateNames.length} template(s) sauvegardé(s)`)
      .setTimestamp();

    for (const name of templateNames) {
      const template = templates[name];
      const createdDate = new Date(template.createdAt);
      const createdTime = Math.floor(createdDate.getTime() / 1000);
      
      embed.addFields({
        name: name,
        value: `${template.composition.name}\n📅 Créé: <t:${createdTime}:R>`,
        inline: true
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (subcommand === 'delete') {
    const templateName = interaction.options.getString('nom');
    const success = await persistence.deleteUserTemplate(userId, templateName);

    if (success) {
      await interaction.reply({
        content: `✅ Template **${templateName}** supprimé.`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: `❌ Template **${templateName}** introuvable.`,
        ephemeral: true
      });
    }
  }
}

// Autocomplete pour les noms de templates
export async function autocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  const userId = interaction.user.id;
  const templates = await persistence.getUserTemplates(userId);
  const choices = Object.keys(templates);

  const filtered = choices
    .filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()))
    .slice(0, 25); // Discord limite à 25 choix

  await interaction.respond(
    filtered.map(choice => ({ name: choice, value: choice }))
  );
}
