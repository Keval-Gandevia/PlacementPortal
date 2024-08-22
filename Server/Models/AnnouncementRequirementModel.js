module.exports = (sequelize, DataTypes) => {

    const AnnouncementRequirement = sequelize.define("AnnouncementRequirement", {

        Requirement_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },

        Announcement_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        Type: {
            type: DataTypes.STRING,
            allowNull: false
        },

        Requirement_Text: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        Additional_Text: {
            type: DataTypes.TEXT,
            allowNull: false
        }

    },
        {
            timestamps: false
        }
    )

    return AnnouncementRequirement
}