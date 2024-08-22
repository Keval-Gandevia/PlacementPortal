module.exports = (sequelize, DataTypes) => {

    const Students = sequelize.define("student", {
        Student_ID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        MiddleName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Admission_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Cast_category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Gender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        DOB: {
            type: DataTypes.DATE,
            allowNull: true
        },
        SSC_Percentage: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        SSC_Percentile: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        SSC_Board: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SSC_School: {
            type: DataTypes.STRING,
            allowNull: true
        },
        HSC_Percentage: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        HSC_Percentile: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        HSC_Board: {
            type: DataTypes.STRING,
            allowNull: true
        },
        HSC_School: {
            type: DataTypes.STRING,
            allowNull: true
        },
        IsD2D: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Diploma_Result_CPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Diploma_Result_Percentage: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Diploma_College_Name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Diploma_University: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Sem_1_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_2_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_3_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_4_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_5_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_6_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_7_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Sem_8_SPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Current_CPI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        Enrollment_year: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Passed_out_year: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Email_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_No_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Contact_No_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        City: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Pin_Code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Current_semester: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Career_Preference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CV_Upload: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Student_Photo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Branch_Id: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        timestamps: false
    })
    return Students
}