import { Grid, Button, TextField, Divider, Typography, Modal, CircularProgress } from '@material-ui/core'
import React, { useState } from 'react'
import MainCard from '../../ui-component/cards/MainCard'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import UsePost from '../../Utilities/UsePost'
import { toast } from 'react-toastify'

export default function AnnouncementNotification() {

    const location = useLocation()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let announcementIdx = location.pathname.split("/")[3]

    const [data, setData] = useState({ Subject: "", Header: "", Body: "" })

    const handleSendMail = async () => {

        handleOpen()


        if (data["Subject"] == "" || data["Header"] == "" || data["Body"] == "") {

            toast.error("All fields are compulsary.")
        }
        else {



            const status = await UsePost("/subscribeannouncement/sendSubscribedStudentsMail/" + announcementIdx, data, "POST")

            if (status) {
                toast.success("Mail Sent Successfully")
            }
            else {
                toast.error("Some error while sending mail.")
            }
            console.log(data)

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
        <MainCard title="Send Notification">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CircularProgress style={style} color="primary" />
            </Modal>
            <Grid container spacing={2}>
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
            <p>Note: All the student subscribed to this announcement would recieve this mail. Sending mail might take a while.</p>
            <br />
            <br />

        </MainCard >
    )
}
