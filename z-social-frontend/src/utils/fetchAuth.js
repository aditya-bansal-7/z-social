export const fetchAuth = () => {
    const query = `*[_type == "user" && email == $email][0]`;
    return query;
}