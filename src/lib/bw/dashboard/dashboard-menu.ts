export default [
    {
        name: "Users",
        link: "/dashboard/users",
        icon: "users"
    },
    {
        name: "Prizes",
        link: "/dashboard/prizes",
        icon: "gift"
    },
    {
        name: "Settings",
        link: "/dashboard/settings",
        icon: "cog",
        submenu: [
            // {name: "Settings", link: "/dashboard/settings"},
            {name: "SMTP", link: "/dashboard/settings/smtp"},
            {name: "Admins", link: "/dashboard/settings/admins"},
        ]
    }
]
