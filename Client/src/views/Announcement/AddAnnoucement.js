import React from 'react';
import { useState, useEffect } from 'react';
import MainCard from '../../ui-component/cards/MainCard';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import DateTimePicker from '@mui/lab/DateTimePicker';
import {
    Card,
    Box,
    TextField,
    MenuItem,
    FormControl,
    Radio,
    RadioGroup,
    FormLabel,
    FormControlLabel,
    Switch,
    FormGroup,
    Stack,
    Button,
    Checkbox,
    Typography,
    Chip
} from '@material-ui/core';
import SecondaryAction from './../../ui-component/cards/CardSecondaryAction';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import UsePostFile from '../../Utilities/UsePostFile';
import responsePipelineHandler from '../../Utilities/ResponsePipelineHandler';
import HandleToast from '../../Utilities/HandleToast';
import { ToastContainer, toast } from 'react-toastify';
import UseFetch from '../../Utilities/UseFetch';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus } from '@tabler/icons';
// import Chip from '@material-ui/core';
import { IconInfoCircle } from '@tabler/icons';
// style constant

const useStyles = makeStyles((theme) => ({
    frame: {
        height: 'calc(100vh - 210px)',
        border: '1px solid',
        borderColor: theme.palette.primary.light
    }
}));

// getting required data

// List of Eligible Branches

const Branches = [
    {
        value: 'CE',
        label: 'Computer Engineering',
        checked: true
    },
    {
        value: 'IT',
        label: 'Information Technology',
        checked: false
    },
    {
        value: 'EC',
        label: 'Electronics & Communication',
        checked: false
    }
];

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));



const Input = styled('input')({
    display: 'none'
});

function AddAnnoucement() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [open1, setOpen1] = React.useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);

    
    const [open2, setOpen2] = React.useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);


    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const [data, setData] = useState({
        Company_ID: '',
        Date_of_announcement: new Date(),
        Date_of_Visit: new Date(),
        Eligible_Branches: ["CE"],
        Passed_out_year: null,
        Job_Role: '',
        Salary: '',
        Job_Location: '',
        Bond_Details: '',
        Other_Details: '',
        Registration_Deadline: null,
        Eligibility: '',
        sendMail: false,
        Job_Preferences: [],
        Additional_Fields:[]
    });
    useEffect(() => { }, [data]);


    const handleRoleAdd = function () {
        let dataCopy = data
        dataCopy.Job_Preferences.push(Role)
        setData(dataCopy)
        console.log(data)
        handleClose1()
        setRole("")
    }
    
    const handleFieldAdd = function () {
        let dataCopy = data
        dataCopy.Additional_Fields.push(Fields)
        setData(dataCopy)
        console.log(data)
        handleClose2()
        setFields("")
    }

    const handleDeleteRole = function (elem) {
        let Preference = data.Job_Preferences.filter((element) => {
            return element != elem
        })
        console.log(Preference)
        setData({ ...data, Job_Preferences: [].concat(Preference) })
    }
     const handleDeleteField = function (elem) {
        let Field = data.Additional_Fields.filter((element) => {
            return element != elem
        })
        console.log(Field)
        setData({ ...data, Additional_Fields: [].concat(Field) })
    }

    const [AdditionalRequirement, setAdditionalRequirement] = useState(false)
    const [AdditionalFields, setAdditionalFields] = useState(false)
    const [Role, setRole] = useState("")
    const [Fields, setFields] = useState("")

    const { required_data, loading } = UseFetch('/annoucement/requiredAnnoucementDetails', 'GET');

    let companies = [];
    if (!loading) {
        // console.log(required_data["data"].length);
        for (let i = 0; i < required_data['data'].length; i++) {
            // console.log("Company Id: ", required_data["data"][i]["Company_ID"]);
            var obj = {};
            obj['value'] = required_data['data'][i]['Company_ID'];
            obj['label'] = required_data['data'][i]['Company_name'];
            companies.push(obj);
        }

        // console.log(companies)
    }

    const changeHandler = (event) => {
        console.log(event.target.files[0]['name']);
        document.getElementById('fileUploadName').innerText = ' ' + event.target.files[0]['name'];
        const file_data = event.target.files[0];
        let temp = data;
        temp['Job_Description_File'] = file_data;
        setData(temp);
    };

    async function handleSubmit() {
        handleOpen();
        const res = await UsePostFile('/annoucement/addAnnoucement', data, 'POST');
        const params1 = {
            data: res,
            HandleToast: {
                toast: toast,
                flag: false
            }
        };
        handleClose();
        console.log(res);
        responsePipelineHandler(params1, 1);
    }

    async function handleSendEmail() {

    }


    function handleCheckBox(branchName, c) {
        for (let i = 0; i < Branches.length; i++) {
            if (Branches[i]["value"] == branchName) {
                // console.log("Jenil")
                if (Branches[i]["checked"] == false) {
                    Branches[i]["checked"] = true
                }
                else {
                    Branches[i]["checked"] = false
                }
            }
        }
        const branches = []
        const dataCopy = data
        for (let i = 0; i < Branches.length; i++) {
            if (Branches[i]["checked"] == true) {
                branches.push(Branches[i]["value"])
            }
        }
        dataCopy["Eligible_Branches"] = branches
        setData(dataCopy)
        console.log(data)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '2%',
        p: 4
    };
    return (
        <MainCard title="Add Announcement">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CircularProgress style={style} color="primary" />
            </Modal>
            <form enctype="multipart/form-data">
                {/* <TextField
                    fullWidth
                    label="Company Name"
                    id="fullWidth"
                    helperText="Enter Comapny Name"
                    value={data['Company_Name']}
                    onChange={(e) => {
                        setData({ ...data, Company_Name: e.target.value });
                    }}
                /> */}
                <TextField
                    fullWidth
                    id="companies"
                    select
                    // required
                    label="Select Company"
                    value={data['Company_ID']}
                    onChange={(e) => {
                        setData({ ...data, Company_ID: e.target.value });
                    }}
                >
                    {companies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <br />
                <br />
                <Grid container spacing={2}>
                    {/* <Grid item md={4} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date of Visit"
                                // required
                                value={data['Date_of_Visit']}
                                onChange={(e) => {
                                    setData({ ...data, Date_of_Visit: e });
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid> */}
                    {/* <Grid item md={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date of Annoucement"
                                // required
                                value={data['Date_of_announcement']}
                                onChange={(e) => {
                                    setData({ ...data, Date_of_announcement: e });
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid> */}
                    <Grid item md={12} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year']}
                                label="Passed Out Year"
                                // required
                                value={data['Passed_out_year']}
                                onChange={(e) => {
                                    setData({ ...data, Passed_out_year: e });
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container
                    direction="row">
                    {/* <Checkbox value={"Jenil"} label={"Jenil"} /> */}
                    {
                        Branches.map((e) => {
                            return (
                                <>
                                    <div>
                                        <Checkbox
                                            checked={e.checked}
                                            value={e.value}
                                            onClick={() => handleCheckBox(e.value, e)}
                                        /><label>{e.label}</label>
                                    </div>
                                </>
                            )
                        })
                    }
                </Grid>


                {/* <TextField
                    fullWidth
                    id="eligible-currencies"
                    select
                    // required
                    label="Select Branch"
                    value={data['Eligible_Branches']}
                    onChange={(e) => {
                        setData({ ...data, Eligible_Branches: e.target.value });
                    }}
                >
                    {Branches.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField> */}
                <br />
                <br />
                <TextField
                    fullWidth
                    // required
                    label="Job Role"
                    id="fullWidth"
                    helperText="Enter Job Role"
                    value={data['Job_Role']}
                    onChange={(e) => {
                        setData({ ...data, Job_Role: e.target.value });
                    }}
                />
                <br />
                <br />
                <TextField
                    fullWidth
                    // required
                    label="Salary"
                    id="fullWidth"
                    helperText="Enter Salary"
                    value={data['Salary']}
                    onChange={(e) => {
                        setData({ ...data, Salary: e.target.value });
                    }}
                />
                <br />
                <br />
                <TextField
                    fullWidth
                    // required
                    label="Job Location"
                    id="fullWidth"
                    helperText="Enter Job Location"
                    value={data['Job_Location']}
                    onChange={(e) => {
                        setData({ ...data, Job_Location: e.target.value });
                    }}
                />
                <br />
                <br />
                <TextField
                    fullWidth
                    // required
                    label="Bond Details"
                    id="fullWidth"
                    helperText="Enter Bond Details"
                    value={data['Bond_Details']}
                    onChange={(e) => {
                        setData({ ...data, Bond_Details: e.target.value });
                    }}
                />
                <br />
                <br />
                <TextField
                    fullWidth
                    // required
                    label="Other Details"
                    id="fullWidth"
                    multiline
                    rows={5}
                    maxRows={4}
                    helperText="Enter Other Details"
                    value={data['Other_Details']}
                    onChange={(e) => {
                        setData({ ...data, Other_Details: e.target.value });
                    }}
                />
                <br />
                <br />
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <Grid item>
                        <label htmlFor="contained-button-file">
                            {/* <label>Job Description File</label>    */}
                            <Input
                                onChange={changeHandler}
                                // required
                                // accept="image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                            />
                            <Button variant="outlined" component="span">
                                Upload Job Description File
                            </Button>
                            <label id="fileUploadName"> </label>
                        </label>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {/* <DatePicker
                                label="Registration Deadline"
                                // required
                                value={data['Registration_Deadline']}
                                onChange={(e) => {
                                    setData({ ...data, Registration_Deadline: e });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            /> */}
                            <DateTimePicker
                                label="Registration Deadline"
                                value={data['Registration_Deadline']}
                                onChange={(e) => {
                                    setData({ ...data, Registration_Deadline: e });
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    {/* <Grid item>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year']}
                                required
                                label="Passed Out Year"
                                value={data['Registration_Deadline']}
                                onChange={(e) => {
                                    setData({ ...data, Registration_Deadline: e });
                                }}
                                renderInput={(params) => <TextField {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Grid> */}
                </Grid>
                <br />
                {/* <Grid container direction="row">
                    <FormLabel id="demo-controlled-radio-buttons-group"
                    // style={{ alignItems: "center", alignContent: "center" }}
                    >
                    Send Email Notification
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="no"
                    >
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    </RadioGroup>
                </Grid> */}

                <TextField
                    fullWidth
                    // required
                    label="Eligibility"
                    id="fullWidth"
                    helperText="Eligibility"
                    value={data['Eligibility']}
                    onChange={(e) => {
                        setData({ ...data, Eligibility: e.target.value });
                    }}
                />
                <Grid container
                    direction="row">
                    <Grid item>

                        <Checkbox value={"Jenil"} label="Send Email"
                            onClick={(e) => {
                                setData({ ...data, sendMail: e.target.checked });
                                // console.log(e.target.checked)
                            }}
                        /><label>Send Email &nbsp; &nbsp; &nbsp; <b>(Note: Sending mails might take a while)</b></label>
                    </Grid>
                </Grid>

                {/* <br /> */}
                <br />
                <Grid container
                    direction="row">
                    <Grid item>

                        <Checkbox value={"Jenil"} label="Preference Requirement"
                            onClick={(e) => {
                                // let checked = e.target.checked
                                setAdditionalRequirement(e.target.checked ? true : false);
                                if (!e.target.checked) {
                                    console.log("Here")
                                    let DataCopy = data
                                    DataCopy.Job_Preferences = [].concat([])
                                    setData(DataCopy)
                                }
                                console.log(data)
                            }}
                        /><label>Preference Requirement &nbsp; &nbsp; &nbsp;</label>
                    </Grid>
                </Grid>
                {AdditionalRequirement ? <> <Grid container
                    direction="row">
                    {/* <br /> */}

                </Grid>
                    {/* <br /> */}
                    {/* <Grid item>
                        <Button onClick={handleOpen1}>Add</Button>
                    </Grid> */}
                    <br />
                    <Button
                        size="medium"
                        onClick={handleOpen1}
                        variant="contained"
                        startIcon={<IconPlus />}
                    >
                        Add Job Preference
                    </Button>
                    <br />
                    <br />
                    {data.Job_Preferences.map((elem) => {
                        return (<>
                            <Chip
                                style={{ margin: '1%' }}
                                icon={IconInfoCircle}
                                variant="outlined"
                                color="primary"
                                onDelete={() => handleDeleteRole(elem)}
                                label={elem}
                            />

                        </>)
                    })}
                    <br />

                </> : ""}
                <br />
                




                <Grid container
                    direction="row">
                    <Grid item>

                        <Checkbox value={"Jenil"} label="Additional Fields"
                            onClick={(e) => {
                                // let checked = e.target.checked
                                setAdditionalFields(e.target.checked ? true : false);
                                if (!e.target.checked) {
                                    console.log("Here")
                                    let DataCopy = data
                                    DataCopy.Job_Preferences = [].concat([])
                                    setData(DataCopy)
                                }
                                console.log(data)
                            }}
                        /><label>Additional Fields &nbsp; &nbsp; &nbsp;</label>
                    </Grid>
                </Grid>
                {AdditionalFields?<>
                
                 <Button
                        size="medium"
                        onClick={handleOpen2}
                        variant="contained"
                        startIcon={<IconPlus />}
                    >
                        Add Additional Fields
                    </Button>
                    <br/>
                    <br/>
                    {data.Additional_Fields.map((elem) => {
                        return (<>
                            <Chip
                                style={{ margin: '1%' }}
                                icon={IconInfoCircle}
                                variant="outlined"
                                color="primary"
                                onDelete={() => handleDeleteField(elem)}
                                label={elem}
                            />

                        </>)
                    })}
                    <br />
                
                </>:""}
                <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                        <Button onClick={handleSubmit} variant="contained" size="large" color="primary">
                            Add Announcement
                        </Button>
                    </Grid>
                </Grid>
                <Modal
                    open={open1}
                    onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >

                    <Box sx={style1}>
                        <Grid spacing={2} container justifyContent={'space-between'}>
                            <Grid item>
                                <TextField
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                    }}
                                    value={Role}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    size="medium"
                                    onClick={() => {
                                        handleRoleAdd();
                                    }}
                                    variant="contained"
                                    startIcon={<IconPlus />}
                                >
                                    Add Role
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Modal>


                <Modal
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >

                    <Box sx={style1}>
                        <Grid spacing={2} container justifyContent={'space-between'}>
                            <Grid item>
                                <TextField
                                    onChange={(e) => {
                                        setFields(e.target.value);
                                        console.log(Fields)
                                    }}
                                    value={Fields}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    size="medium"
                                    onClick={() => {
                                        handleFieldAdd();
                                    }}
                                    variant="contained"
                                    startIcon={<IconPlus />}
                                >
                                    Add Field
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Modal>

            </form>
        </MainCard>
    );
}

export default AddAnnoucement;
