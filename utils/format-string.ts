/**
 * Convertit une chaîne de caractères en snake_case.
 * @param input - La chaîne de caractères à convertir.
 * @returns La chaîne convertie en snake_case.
 */
export function toSnakeCase(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Ajoute un underscore entre les minuscules et majuscules
        .replace(/\s+/g, '_')              // Remplace les espaces par des underscores
        .replace(/[^a-zA-Z0-9_]/g, '_')     // Supprime les caractères non-alphanumériques
        .toLowerCase();                    // Convertit en minuscules
}