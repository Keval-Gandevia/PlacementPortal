// ---------------- || COMPANY MODEL || ----------------
module.exports = (sequelize, DataTypes) => {
    const Companies = sequelize.define("Company", {
        Company_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Company_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Contact_person_1_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_1_email_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_1_designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_1_Mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_2_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_2_email_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_2_designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_2_Mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_3_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_3_email_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_3_designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_person_3_Mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Company_web_site: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Company_offer_type: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        City: {
            type: DataTypes.STRING,
            allowNull: true
        },
        State: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        timestamps: false
    })
    return Companies
}