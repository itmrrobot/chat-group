export const getProfileFromLS = () => {
    const result = localStorage.getItem('user')
    return result ? JSON.parse(result) : null
 }