import { Grid, Button, TextField, Divider, Typography, Modal, CircularProgress } from '@material-ui/core'
import React, { useState } from 'react'
import MainCard from '../../ui-component/cards/MainCard'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import UsePost from '../../Utilities/UsePost'
import { toast } from 'react-toastify'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default function BatchNotification() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [data, setData] = useState({ Subject: "", Header: "", Body: "" })

    const handleSendMail = async () => {
        handleOpen()

        if (data["Passed_out_year"] == "" || data["Subject"] == "" || data["Header"] == "" || data["Body"] == "") {
            toast.error("All fields are compulsary.")
        }
        else {
            const status = await UsePost("/student/sendStudentsBatchMailNotification/", data, "POST")

            console.log("email status : ", status)

            if (status?.status) {
                toast.success(status?.data)
            }
            else {
                toast.error(status?.data)
            }

            // console.log(data)
        }
        handleClose()
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <MainCard title="Send Batch Mail Notification">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CircularProgress style={style} color="primary" />
            </Modal>
            <Grid container spacing={2}>
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
                <Grid item xs={12} md={12}>
                    <TextField
                        value={data['Subject']}
                        onChange={(e) => {
                            setData({ ...data, Subject: e.target.value });
                        }}
                        fullWidth
                        label="Subject" />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        value={data['Header']}
                        onChange={(e) => {
                            setData({ ...data, Header: e.target.value });
                        }}
                        fullWidth
                        label="Header" />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        value={data['Body']}
                        onChange={(e) => {
                            setData({ ...data, Body: e.target.value });
                        }}
                        fullWidth
                        label="Body"
                        rows={5}
                        maxRows={4}
                        multiline />
                </Grid>
            </Grid>
            <br />
            <Button onClick={() => handleSendMail()} variant='contained'>Send Mail</Button>
            <p>Note: Mail will be sent to all students having passed out year as selected above. Sending mail might take a while.</p>
            <br />
            <br />

        </MainCard >
    )
}
