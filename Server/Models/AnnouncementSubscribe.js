module.exports = (sequelize, DataTypes) => {

    const Subscribe = sequelize.define("AnnouncmentSubsribe", {
        Announcement_ID: {
            type: DataTypes.INTEGER,
        },
        Student_ID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Job_Preferences: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        AdditionalData: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    },
        {
            timestamps: false
        }
    )

    return Subscribe
}