module.exports = (user, report) => (
    (user.roles[0].id === 1)
    || (user.roles[0].id === 2 && user.id === report.user_id)
);
