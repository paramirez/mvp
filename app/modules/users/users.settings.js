/**
 * @author Pablo Ramirez
 * @description String que determina que campos se desea que sean publicos en una petición
 *
 * Si se quiere habilitar un campo se debe agregar separado de espacis
 * @example 'email name id'
 *
 * Si se quiere denegar la vista a un campo se debe anteponer un guión
 *
 * @example '-email name -id'
 */
export const userPublicFieldAccess = 'email isDeleted userId -_id';
export const rolPublicFieldAccess = 'name isDeleted rolId -_id';
