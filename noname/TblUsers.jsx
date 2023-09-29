import React from 'react'
import { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import './tblusers.css'
import {FaTrash, FaUserPlus, FaUserCog} from "react-icons/fa";
import { Tooltip } from '@mui/material';
import UpSertUserModal from '../../../../components/usersModals/UpSertUserModal';
import { getAllUsers, getOne, getUserRol } from '../../../../components/Request/usersPetitions';
import DeleteUserModal from '../../../../components/usersModals/DeleteUserModal';
import DropDownMenu from '../../../../components/Menu/DropDownMenu';
import Navb from '../../../../components/Nav/Navb';

const TblUsers = () => {


  //configuracion de hooks
  const [datos, setDatos] = useState([])
  const [tipos, setTipos] = useState([])
  useEffect(() => {
    getAllUsers(setDatos);
    getUserRol(setTipos);
  }, [])

  const [eliminar, setEliminar] = useState(false)
  const [upSert, setUpsert] = useState(false)
  const [idEliminar, setIdEliminar] = useState(false)
  const [rol, setRol] = useState('')
  const [upsertRol, setUpsertRol] = useState('')


  const[idUser, setIdUser] = useState(false)
  let tipo_usuario = ''
  let id_usuario = false
  const [tituloModal, setTituloModal ] = useState('')
  const [userType, setUserType] = useState('')
  let tipo_peticion = ''
  const [peticion, setPeticion] = useState('')
  let typeDesc = ''
  const title = "Registros"

  const [fullName, setFullName] = useState('')

  let nombre_completo = ''
    

  //definimos las columnas
  const columns = [
    {
      name: 'username',
      label: 'Usuario',
      options: {
        customBodyRender: (val) => {
          return val === null ? '---Sin usuario---' : val;
          }
      }
    },
    {
      name: 'rfc',
      label: 'RFC'
    },
    
    {
      name: 'name',
      label: 'Nombre(s)'
    },
    {
      name: 'lastname',
      label: 'Apellidos'
    },
    {
      name: 'email',
      label: 'Correo',
      options:{
        customBodyRender: (val) => {
          return val === null ? '---------------------' : val;
          }
      }
    },
    {
      name: 'phone',
      label: 'Telefono'
    },
    {
      name: 'tipo',
      label: 'Tipo'
    },
    {
      name: 'have_user',
      label: 'Acciones',
      options: {
        filter: false,
        customBodyRender: (val, tableMeta  ) =>{
          return val == false ? 
          <>
            <Tooltip title = 'Asignar configuracion de usuario'>
              <a className='add-user'
              onClick={()=> {
                tipo_usuario = datos[tableMeta.rowIndex].tipo
                setUserType(tipo_usuario)
                tipo_usuario == 'Cliente' ? id_usuario = datos[tableMeta.rowIndex].id_customer : id_usuario = datos[tableMeta.rowIndex].id_employee
                setIdUser(id_usuario)
                setTituloModal('Registro de Usuario')
                tipo_peticion = 'post'
                setPeticion(tipo_peticion)
                setUpsert(true)
                getUserRol(setTipos)
              }}
              > <FaUserPlus></FaUserPlus> </a>
            </Tooltip>
          </> 
          : 
          <> 
            <Tooltip title='Editar configuracion de usuario'>
            <a className=' edit'  onClick={() => {
                id_usuario = datos[tableMeta.rowIndex].id_user
                setUpsertRol(datos[tableMeta.rowIndex].id_rol)
                setIdUser(id_usuario)
                setTituloModal('Editar configuracion de usuario')
                tipo_peticion = 'put'
                setPeticion(tipo_peticion)
                getOne(id_usuario)
                setUpsert(true)
                setRol(typeDesc)
                }}>
                <FaUserCog ></FaUserCog>
              </a>
            </Tooltip>
            <Tooltip title='Eliminar credenciales'>
            <a className=' delete'  onClick={() => {
                setEliminar(true)
                setIdEliminar(datos[tableMeta.rowIndex].id_user)
                nombre_completo = datos[tableMeta.rowIndex].name + ' ' + datos[tableMeta.rowIndex].lastname
                setFullName(nombre_completo)
              }}>
                <FaTrash></FaTrash>
              </a>
            </Tooltip>
          </>
        }

      }
    },

  ]


  //definimos las opciones
  const options = {
    selectableRows: false,
    responsive: "standard",
    sort: false,
    download: false,
    print: false,
    filterType: "dropdown",
    rowsPerPageOptions: [5, 10, 15, 20],
    labelDisplayedRow: "de",
    textLabels: {
      body: {
        noMatch: "No se encontraron resultados!"
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Registros por página:",
        displayRows: "de"
      }
    }
  };



  return (
    <>
      <DropDownMenu></DropDownMenu>

      <div className="padre">
      <MUIDataTable className = 'dtable'
        title={title}
        data={datos}
        columns={columns}
        options={options}
      />
      </div>
      

      <UpSertUserModal ocultar={upSert} mostrar={setUpsert} data = {setDatos} id_user={idUser} titulo = {tituloModal} tipo={userType} petition={peticion} roles={tipos} id_rol = {upsertRol}></UpSertUserModal>

      <DeleteUserModal ocultar={eliminar} mostrar={setEliminar} nusuario={fullName} id_user={idEliminar} data={setDatos}> </DeleteUserModal>
    </>
  )
}

export default TblUsers