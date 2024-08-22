import React from 'react';
import MainCard from '../../ui-component/cards/MainCard';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import { IconDashboard, IconDeviceAnalytics, IconSpeakerphone } from '@tabler/icons';
import { useHistory } from 'react-router';
import UseFetch from '../../Utilities/UseFetch';
import { useLocation } from 'react-router-dom';
// import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import domainConfig from '../../Config/domainConfig';
import { toast } from 'react-toastify';


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

function ViewSubscribedStudents() {
    const location = useLocation().pathname;
    const id = location.split('/')[3];

    const announcementData = UseFetch("/annoucement/getAnnoucement/" + id, "GET")

    const jobPreferences1 = announcementData?.required_data?.data[0]?.Job_Preferences;
    const additionalField = announcementData?.required_data?.data[0]?.Additional_Fields;
    // console.log(additionalField);

    console.log("announcement data : ", jobPreferences1)

    const { required_data, loading } = UseFetch('/subscribeannouncement/getSubscribedStudentsOfAnnouncement/' + id, 'GET');

    let students_list = [];

    if (!loading) {
        // console.log("required data : ", required_data["data"]);

        for (let i = 0; i < required_data['data'].length; i++) {

            var obj = {};

            obj = required_data['data'][i]["studentDetails"];
            let Fields = required_data['data'][i]['additionalData'];
            console.log(required_data['data'][i])
            console.log(Fields)
            if (required_data['data'][i]?.jobPreferences != null) {

                let jobPreferences = []

                required_data['data'][i]?.jobPreferences.split(",").map((item) => {
                    jobPreferences.push(item)
                })

                // console.log(`students_list[0]["Job_Preferences"] : `, jobPreferences.length)

                let j = 1

                for (let i = 0; i < jobPreferences.length; i++) {

                    let label = "Job_Preferences_" + j
                    j++
                    obj[label] = jobPreferences[i]
                }

                obj.Job_Preferences = required_data['data'][i]["jobPreferences"]
            }

            if (Fields==null||Fields=="")
            {
            }
            else{
                let jsonData = JSON.parse(Fields)
                let AllKeys = Object.keys(jsonData)
                for(let i=0;i<AllKeys.length;i++)
                {
                    obj[AllKeys[i]] = jsonData[AllKeys[i]]
                }
                console.log(AllKeys)
            }
            // console.log("one object : ", obj)
            students_list.push(obj);
        }

        // <a
        //     target="_blank"
        //     style={{ "text-decoration": "none" }}
        //     href={

        //         process.env.NODE_ENV == "production" ?
        //             process.env.React_App_DOMAIN + "/subscribeannouncement/downloadSubscribedStudentZip/" + announcement_details["Announcement_ID"] : "http://localhost:8000" + "/subscribeannouncement/downloadSubscribedStudentZip/" + announcement_details["Announcement_ID"]


        //     }>



        // sort the array based on CPI of the student
        students_list.sort(function (a, b) {
            console.log(a.Current_CPI + " " + b.Current_CPI)
            return b.Current_CPI - a.Current_CPI
        });

        console.log("student_list : ", students_list);
    }

    const icons = {
        IconDashboard: IconDashboard,
        IconDeviceAnalytics,
        IconSpeakerphone
    };

    const rows = [];

    const columns = [
        { field: 'id', headerName: 'ID', hide: true },
        { field: 'Student_ID', headerName: 'Student_ID', width: 200, editable: false },
        { field: 'FirstName', headerName: 'First Name', width: 200, editable: false },
        { field: 'MiddleName', headerName: 'Middle Name', width: 200, editable: false },
        { field: 'LastName', headerName: 'Last Name', width: 200, editable: false },
        { field: 'SSC_Percentage', headerName: 'SSC Percentage', width: 200, editable: false },
        { field: 'HSC_Percentage', headerName: 'HSC Percentage', width: 200, editable: false },
        { field: 'Current_CPI', headerName: 'Current CPI', width: 200, editable: false },
        { field: 'Email_ID', headerName: 'Email ID', width: 200, editable: false },
        { field: 'Contact_No_1', headerName: 'Contact No 1', width: 200, editable: false },
        { field: 'Contact_No_2', headerName: 'Contact No 2', width: 200, editable: false },
        // hidden columns
        { field: 'Admission_type', headerName: 'Admission Type', width: 185, editable: false, hide: true },
        { field: 'Cast_category', headerName: 'Cast Category', width: 175, editable: false, hide: true },
        { field: 'Gender', headerName: 'Gender', width: 135, editable: false, hide: true },
        { field: 'DOB', headerName: 'Date of Birth', width: 170, editable: false, hide: true },
        { field: 'SSC_Percentile', headerName: 'SSC Percentile', width: 180, editable: false, hide: true },
        { field: 'SSC_Board', headerName: 'SSC Board', width: 155, editable: false, hide: true },
        { field: 'SSC_School', headerName: 'SSC School', width: 200, editable: false, hide: true },
        { field: 'HSC_Percentile', headerName: 'HSC Percentile', width: 180, editable: false, hide: true },
        { field: 'HSC_Board', headerName: 'HSC Board', width: 155, editable: false, hide: true },
        { field: 'HSC_School', headerName: 'HSC School', width: 200, editable: false, hide: true },
        { field: 'IsD2D', headerName: 'Is D2D', width: 145, editable: false, hide: true },
        { field: 'Diploma_Result_CPI', headerName: 'Diploma Result CPI', width: 220, editable: false, hide: true },
        { field: 'Diploma_Result_Percentage', headerName: 'Diploma Result Percentage', width: 220, editable: false, hide: true },
        { field: 'Diploma_College_Name', headerName: 'Diploma College Name', width: 200, editable: false, hide: true },
        { field: 'Diploma_University', headerName: 'Diploma University', width: 230, editable: false, hide: true },
        { field: 'Sem_1_SPI', headerName: 'Sem - 1 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_2_SPI', headerName: 'Sem - 2 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_3_SPI', headerName: 'Sem - 3 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_4_SPI', headerName: 'Sem - 4 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_5_SPI', headerName: 'Sem - 5 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_6_SPI', headerName: 'Sem - 6 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_7_SPI', headerName: 'Sem - 7 SPI', width: 165, editable: false, hide: true },
        { field: 'Sem_8_SPI', headerName: 'Sem - 8 SPI', width: 165, editable: false, hide: true },
        { field: 'Enrollment_year', headerName: 'Enrollment Year', width: 200, editable: false, hide: true },
        { field: 'Passed_out_year', headerName: 'Passed Out Year', width: 200, editable: false, hide: true },
        { field: 'Address', headerName: 'Address', width: 200, editable: false, hide: true },
        { field: 'City', headerName: 'City', width: 200, editable: false, hide: true },
        { field: 'Pin_Code', headerName: 'Pin Code', width: 155, editable: false, hide: true },
        { field: 'Current_semester', headerName: 'Current Semester', width: 200, editable: false, hide: true },
        { field: 'Career_Preference', headerName: 'Career Preference', width: 200, editable: false, hide: true },
        { field: 'Skills', headerName: 'Skills', width: 200, editable: false, hide: true },
    ];





    if (jobPreferences1 != null) {

        let jobPreferences = []

        jobPreferences1.split(",").map((item) => {
            jobPreferences.push(item)
        })

        for (let i = 1; i <= jobPreferences.length; i++) {
            columns.push(
                { field: 'Job_Preferences_' + i, headerName: 'Job Preference - ' + i, width: 200, editable: false },
            )
        }
    }

    if(additionalField==null||additionalField=="")
    {
    }
    else{
        let additionalFields = []
        additionalField.split(",").map((item)=>{
            additionalFields.push(item)
        })
        for(let i=0;i<additionalFields.length;i++)
        {
            columns.push({ field: additionalFields[i], headerName: additionalFields[i], width: 200, editable: false });
        }
    }



    const [editRowsModel, setEditRowsModel] = React.useState({});
    const handleEditRowsModelChange = React.useCallback((model) => {
        setEditRowsModel(model);
    }, []);
    const [folderData, setfolderData] = React.useState(undefined)
    const [folderLink, setfolderLink] = React.useState(undefined)

    const history = useHistory();
    // const id = history.location.pathname.split("/")
    console.log(id)


    // async function handleClick() {
    //     console.log("Here")
    //     // const link = '/subscribeannouncement/downloadSubscribedStudentZip/' + id
    //     // const resp = await axios.post(link)
    //     // setfolderData(true)
    //     // const driveLink = resp.data
    //     // setfolderData(false)
    //     // const win = window.open(driveLink, "_blank");
    //     // console.log(resp)
    // }

    async function handleSeeCV()
    {

        console.log('Heknlkdn');
        const link = '/subscribeannouncement/downloadSubscribedStudentZip/' + id
        const resp = await axios.get(link)
        toast.success("Please wait a while")
        setTimeout(()=>{    
            console.log(resp)
            if(resp.data.status)
            {
                window.open(resp.data.data,"_blank")
            }
            else
            {
                toast.error(resp.data.data)
            }
        },1000)
        setfolderData(false)
    }

    return (
        <>
            <MainCard title="Applied Students">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                        {/* <a
                            target="self"
                            style={{ 'text-decoration': 'none' }}
                            href={
                                process.env.NODE_ENV == 'production'
                                    ? // "http://csiddu.tech" +
                                      domainConfig.domain + '/subscribeannouncement/downloadSubscribedStudentZip/' + id
                                    : 'http://localhost:8000' + '/subscribeannouncement/downloadSubscribedStudentZip/' + id
                            }
                        > */}
                            <Button variant="contained" onClick={() => handleSeeCV()} size="large" color="primary">
                                See All CV's
                            </Button>
                        {/* </a> */}
                    </Grid>
                    {folderData === undefined ? (
                        ''
                    ) : folderData == true ? (
                        <Grid item xs={12} md={2}>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        ''
                    )}
                </Grid>
                {/* // </a> */}
                <br />
                <br />
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        checkboxSelection
                        rows={students_list}
                        columns={columns}
                        components={{
                            Toolbar: CustomToolbar
                        }}
                    />
                </div>
            </MainCard>
        </>
    );
}

export default ViewSubscribedStudents;
