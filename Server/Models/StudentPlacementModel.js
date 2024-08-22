module.exports = (sequelize, DataTypes) => {
    const StudentPlacement = sequelize.define("StudentPlacement", {
        Student_ID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Company_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Designation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Salary: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        Offer_Letter: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Passed_out_year: {
            type: DataTypes.DATE,
            allowNull: true
        },
        IsFinal: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },

    }, {
        timestamps: false
    })
    return StudentPlacement
}