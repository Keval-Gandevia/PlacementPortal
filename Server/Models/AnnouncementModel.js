module.exports = (sequelize, DataTypes) => {

    const Announcement = sequelize.define("Announcement", {

        Announcement_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        Company_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Date_of_Visit: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Date_of_announcement: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        Eligible_Branches: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Passed_out_year: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Job_Role: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Salary: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Job_Location: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Bond_Details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Other_Details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Job_Description_File: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Registration_Deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },

        // doubt (JHB Sir)
        Eligibility: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Job_Preferences: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Additional_Fields: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        IsOpen: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }

    },
        {
            timestamps: false
        }
    )
    return Announcement
}