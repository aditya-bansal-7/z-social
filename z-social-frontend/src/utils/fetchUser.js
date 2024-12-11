export const fetchUser = () => {
    const userInfo = localStorage.getItem('user');
    return userInfo !== 'undefined' && userInfo !== null
      ? JSON.parse(userInfo)
      : null;
  };
  