import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useState } from 'react'
import { DELETE_DB } from 'src/db/db'

export const DeleteDBModal = () => {
  const [deleteDBTwoFA, setDeleteDBTwoFA] = useState(false)

  return (
    <div>
      <Button onClick={() => setDeleteDBTwoFA(true)}>DELETE DATABASE</Button>
      <Dialog open={deleteDBTwoFA}>
        <DialogTitle>WARNING</DialogTitle>
        <DialogContent>ARE YOU SURE ? THIS WILL NUKE THE DATABASE!!!</DialogContent>
        <DialogActions>
          <Button color="error" onClick={DELETE_DB}>
            Yes
          </Button>
          <Button variant="contained" color="success" onClick={() => setDeleteDBTwoFA(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
