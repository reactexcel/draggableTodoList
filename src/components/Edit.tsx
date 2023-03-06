import React, { useEffect, useState } from 'react'
import axios from "axios"

const Edit = ({ setIsOpenModal, isEdit, editId, isOpenModal,getUser }: any) => {
    const [rank, setRank] = useState(1)
    const [name, setName] = useState("")

    const closeModal = () => {
        setIsOpenModal(false)
    }

    useEffect(() => {
        if(isEdit){
            axios.get(`http://176.9.137.77:8000/api/v1/${editId}`)
            .then((res) => {
                   setRank(res.data.rank)
                   setName(res.data.name)
                })
                .catch((err)=>{
                    console.log(err);
                    
                })
        }
    },[editId])

    const handleSumbit = async (e: any) => {
        e.preventDefault()
        if (isEdit) {
               await axios.put(`http://176.9.137.77:8000/api/v1/${editId}`,{rank:rank}).then((res)=>{
                if(res.status===201){
                    getUser()
                }
               }
               )
        }
        else {
            const postData = {
                "name": name,
                "rank": rank
            }
            await axios.post(`http://176.9.137.77:8000/api/v1/`, postData).then((res) => {
                if(res.status===200){
                    getUser()
                    setRank(1)
                    setName("")
                }
            })



        }

    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">{isEdit ? "EDIT" : "ADD"}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()} />
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => handleSumbit(e)}>
                            <div className="mb-3">
                                <label className="form-label">Rank</label>
                                <input type="text" value={rank} className="form-control" id="rank" required placeholder="Enter the rank" onChange={(e: any) => setRank(Number(e.target.value))} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Person Name</label>
                                <input disabled={isEdit} type="text" value={name} className="form-control" id="name" required placeholder="Enter the Person Name" onChange={(e: any) => setName(e.target.value)} />
                            </div>
                            <div className="modal-footer">
                                <button id="cancelbtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Cancel</button>
                                <button  type="submit" className="btn btn-primary">{isEdit ? "Edit" : "Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit
