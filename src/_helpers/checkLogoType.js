const allowedLogoTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
/**
 * @param  {} type
 */
export const validateLogoType = (type) => {
    return allowedLogoTypes.includes(type) ? true : false
}
