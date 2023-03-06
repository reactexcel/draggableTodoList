import { useEffect, useState } from "react";
import Edit from "./components/Edit";
import axios from "axios";

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState()
  const [data, setData] = useState<any[]>([])
 
  const handleDrag = (e: any, fromIndex: any, toIndex: any) => {
    e.preventDefault();
    const newData = [...data];
    const toIndexdata = newData[toIndex]
    const fromIndexData = newData[fromIndex]
    const [removed] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, removed);
    setData(newData);
    axios.put(`http://176.9.137.77:8000/api/v1/${toIndexdata.id}`, { rank: fromIndexData.rank }).then((res) => {
      if (res.status === 201) getUser()
    })
    axios.put(`http://176.9.137.77:8000/api/v1/${fromIndexData.id}`, { rank: toIndexdata.rank }).then((res) => {
      if (res.status === 201) getUser()
    })
  };

  const editTableData = (id: any) => {
    setEditId(id)
    setIsEdit(true)
    setIsOpenModal(true)
  }

  const handleDelete = async (id: number) => {
    axios.delete(`http://176.9.137.77:8000/api/v1/${id}`)
      .then((res) => {
        if (res.status === 204) {
          getUser()
        }
      })
  }

  const getUser = async () => {
    axios.get("http://176.9.137.77:8000/api/v1/")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleAction = () => {
    setIsOpenModal(true)
    setIsEdit(false)
  }
  
  useEffect(() => {
    getUser()
  }, [])

  
  return (
    <>

      <div className="container">
        <table className="table table-stripped table-hover m-auto mt-4 w-50">
          <thead>
            <tr className="bg-dark text-light">
              <th></th>
              <th>Rank</th>
              <th>Person Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <>
                  <tr
                    key={item.id}
                    draggable
                    style={{ cursor: "pointer" }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragStart={(e) => e.dataTransfer.setData("index", index.toString())}
                    onDrop={(e) =>
                      handleDrag(e, e.dataTransfer.getData("index"), index)
                    }
                  >
                    <td>==</td>
                    <td>{item.rank}</td>
                    <td>{item.name}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" style={{ marginRight: 5 }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => editTableData(item.id)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                </>
              )
            }
            )}
          </tbody>
        </table>
        <div className="w-100 text-center mt-4">
          <button type="button" className="btn btn-primary" onClick={()=>handleAction()
          } data-bs-toggle="modal" data-bs-target="#exampleModal">
            ADD
          </button>
        </div>
 
      </div>
        {isOpenModal &&
          <Edit setIsOpenModal={setIsOpenModal} isEdit={isEdit} editId={editId} isOpenModal={isOpenModal} getUser={getUser} />
        }
    </>
  );
}
