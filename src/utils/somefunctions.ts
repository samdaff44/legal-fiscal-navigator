
/**
 * Filtre une liste d'éléments pour ne garder que ceux qui sont actifs
 * @param data - Tableau d'éléments à filtrer
 * @returns Tableau contenant uniquement les éléments actifs
 */
export function someFunction(data: any[]): any[] {
    return data.filter(item => item.isActive);
}

/**
 * Version typée de la fonction de filtrage avec un type générique
 * @param data - Tableau d'éléments à filtrer
 * @returns Tableau contenant uniquement les éléments actifs
 */
export function filterActive<T extends { isActive: boolean }>(data: T[]): T[] {
    return data.filter(item => item.isActive);
}
