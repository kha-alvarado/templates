import axios from "../../api/axios";
import { mostrarAlert } from "../alerts/showAlert"
import { validarCampos } from "../validator/validator"

//token
const config = {
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sIjoiYWRtaW4ifQ.mnk6KCpDFetRRbinXXYttNwDLDnP_JmbpBB9pep45N4` }
};


export const upSertUser = async (id_user,tipo, peticion,setDatos,mostrar, rol) => {
    console.log(peticion);
    let rutaUpsert = ''
    let usuario = ''
    let id_tipo = ''
    const userName = document.getElementById("tx-username").value
    const psw = document.getElementById("tx-password").value
    if (peticion == 'post') {
        if (validarCampos(userName) || validarCampos(psw)) {
            mostrarAlert('Campos vacíos!', 'Todos lo datos son obligatorios', 'warning')
        }
    }
    
    peticion === 'post' ? rutaUpsert = 'user/crear' : rutaUpsert = 'user/actualizar/'+id_user

    const data = {
        id_rol: rol,
        username: userName,
    }

    if (peticion ==='post') tipo === 'Cliente' ? (data.id_customer = id_user) : (data.id_employee = id_user);

    if (psw) {
        data.password = psw
    }
    
    try {
        const response = await axios({
            method: peticion,
            url: rutaUpsert,
            headers: config.headers,
            data
        }
        )
        mostrarAlert("Operación exitosa!", "Usuario guardado correctamente", "success");
        getAllUsers(setDatos)
        mostrar(false)
    } catch (error) {
        if (!error?.response) {
            mostrarAlert("No se pudo completar la operación!", "Comuníquese con soporte técnico", "error")
            return
        } else if (error.response?.status === 500) {
            mostrarAlert("Sin conexión al servidor!", "Comuníquese con soporte técnico", "error")
        }
        else if (error.response?.status === 400) {

            mostrarAlert(error.response.data.errores[0].msg + '!', "Verifique los datos ingresados", "error")
        } else if (error.response?.status === 401) {

            mostrarAlert('Error de token!', "Comuniquese con soporte técnico", "error")
        }
    }
}
;//user / crear  user/actualizar/id


export const getOne =  async (id_user) => {
    let ruta = 'user/obtener'
    await axios.get(ruta + '/' + id_user, config)
    .then(response => {
        const data = response.data.user
        const upsUsername = document.getElementById('tx-username').value = data.username;
    }).catch(error => {
        if (!error?.response) {
            mostrarAlert("Los datos no se pudieron cargar!", "Comuníquese con soporte técnico", "error")
            return
        } else if (error.response?.status === 500) {
            mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
        }
        else if (error.response?.status === 400) {
            mostrarAlert(error.response.data.errores[0].msg + '!', "Usuario no encontrado", "error")
        }
    })
}
const urlGet = 'user/obtener';
export const getAllUsers = async (setDatos) => {
    await axios.get(urlGet, config)
        .then(response => {
            const data = response.data.clientes
            setDatos(data);
            console.log(data);
            
        }).catch(error => {
            if (!error?.response) {
                mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
                return
            } else if (error.response?.status === 500) {
                mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
            }
        })
}

export const deleteUser = async (id_user, setDatos, mostrar) => {
    let ruta = '/user/eliminar'
    await axios.delete(`${ruta}?id_user=${id_user}`, config)
    .then(response => {
        getAllUsers(setDatos)
        mostrarAlert("Operación exitosa!", "Se ha eliminado correctamente", "success")
        mostrar(false)
    }).catch(error => {
        if (!error?.response) {
            console.log(error);
            mostrarAlert("Eliminación fallida!", "Comuníquese con soporte técnico", "error")
            return
        }
    })
}

export const getUserRol = async (setTipos) => {
    await axios.get('rol/obtener', config)
    .then(response => {
        const data = response.data
        console.log(data.Categories);
        setTipos(data.Categories)
    }).catch(error => {
        if (!error?.response) {
            mostrarAlert("Error al cargar roles de usuario!", "Comuníquese con soporte técnico", "error")
            return
        } else if (error.response?.status === 500) {
            mostrarAlert("Sin conexión al servidor!", "Comuníquese con soporte técnico", "error")
        }
    })
}