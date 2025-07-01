export function transformBBCode(data: string) {
  data = data.replaceAll("@", "");
  data = data.replaceAll("\r", "");
  data = data.replaceAll("[img:5090045]", ""); /* World Anvil header image */
  data = data.replace("[img:5090046]", "") /* World Anvil footer image */

  /* catch weird spacing within tags */
  data = data.replaceAll("[b] ", " <b>").replaceAll(" [/b]", "</b> ");
  data = data.replaceAll("[i] ", " <i>").replaceAll(" [/i]", "</i> ");

  /* Formatting tags */
  data = data.replaceAll("[i]", "<i>").replaceAll("[/i]", "</i>");
  data = data.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  data = data.replaceAll("[br]", "\n")

  /* Text type tags */
  data = data.replaceAll("[p]", "<p>").replaceAll("[/p]", "</p>");
  data = data.replaceAll("[hr]", "<hr/>");
  data = data.replaceAll("[h1]", "<h1>").replaceAll("[/h1]", "</h1>");
  data = data.replaceAll("[h2]", "<h2>").replaceAll("[/h2]", "</h2>");
  data = data.replaceAll("[ul]", "<ul>").replaceAll("[/ul]", "</ul>");
  data = data.replaceAll("[li]", "<li>").replaceAll("[/li]", "</li>");
  data = data.replaceAll("[quote]", '<blockquote>').replaceAll("[/quote]", "</blockquote>");
  data = data.replaceAll("/*", "<!--").replaceAll("*/", "-->");
  return data;
}

export function transformWorldAnvilLinks(data: string) {
  data = data.replace(/\s*\(person.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(organization.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(landmark.*?\)\s*/g, ' ')
  data = data.replace(/\s*\[Plot.*?\]\s*/g, '');
  data = data.replace(/\s*\(plot.*?\)\s*/g, '');
  data = data.replace(/\s*\(item.*?\)\s*/g, ' ');
  return data;
}

export function correctPunctuation(data: string) {
  data = data.replaceAll(" - ", " &ndash; "); /* replace hypen with emdash */
  data = data.replaceAll(" .", ".") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" ,", ",") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" !", "!") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" </b>", "</b>") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(/"(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g, `“`) /* Replaces opening straight qutoes with curly */
  data = data.replaceAll(/"/g, `”`) /* Replaces closing straight qutoes with curly */
  data = data.replaceAll(/'/g, `’`) /* Replaces straight single quote with curly */
  data = data.replaceAll(" ’", "’") /* Fixes formatting issue caused by prior replaces*/
  return data;
}